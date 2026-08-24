import { useEffect, useState } from 'react'
import { FiLogOut, FiUpload } from 'react-icons/fi'
import { categories } from '../data/portfolioData'
import { supabase } from '../lib/supabase'
import '../App.css'

const defaultCategory = categories[1]

export default function AdminPage() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [category, setCategory] = useState(defaultCategory)
  const [size, setSize] = useState('wide')
  const [files, setFiles] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [galleryItems, setGalleryItems] = useState([])
  const [galleryCategory, setGalleryCategory] = useState('All work')

  useEffect(() => {
    if (!supabase) return undefined

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) loadGallery()
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])

  async function loadGallery() {
    const { data, error: galleryError } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false })
    if (galleryError) setError(galleryError.message)
    else setGalleryItems(data || [])
  }

  async function handleLogin(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
    if (loginError) setError(loginError.message)
    setBusy(false)
  }

  async function handleUpload(event) {
    event.preventDefault()
    if (!files.length) return setError('Choose at least one image.')
    const form = event.currentTarget
    setBusy(true)
    setError('')
    setMessage('')

    const uploadedPaths = []
    try {
      const records = []
      for (const file of files) {
        const filePath = `${category.toLowerCase().replaceAll(' ', '-')}/${crypto.randomUUID()}-${file.name}`
        const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, file, { contentType: file.type, upsert: false })
        if (uploadError) throw uploadError
        uploadedPaths.push(filePath)
        const { data: publicUrl } = supabase.storage.from('portfolio').getPublicUrl(filePath)
        records.push({ category, image_url: publicUrl.publicUrl, size, title, year })
      }

      const { error: insertError } = await supabase.from('gallery_items').insert(records)
      if (insertError) throw insertError
      setMessage(`${files.length} image${files.length === 1 ? '' : 's'} uploaded. They are now live in the selected section.`)
      setTitle('')
      setFiles([])
      form.reset()
      await loadGallery()
    } catch (uploadError) {
      if (uploadedPaths.length) await supabase.storage.from('portfolio').remove(uploadedPaths)
      setError(uploadError.message)
    }
    setBusy(false)
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete ${item.title}?`)) return
    setBusy(true)
    setError('')
    const { data: deletedItems, error: deleteError } = await supabase.from('gallery_items').delete().eq('id', item.id).select('id')
    if (deleteError) {
      setError(deleteError.message)
    } else if (!deletedItems?.length) {
      setError('Image was not deleted. Run the gallery delete policy in Supabase SQL Editor.')
    } else {
      const storagePath = item.storage_path || getStoragePath(item.image_url)
      if (storagePath) await supabase.storage.from('portfolio').remove([storagePath])
      setGalleryItems((items) => items.filter((galleryItem) => galleryItem.id !== item.id))
      setMessage('Image deleted from the gallery.')
    }
    setBusy(false)
  }

  if (!supabase) return <AdminShell><p className="admin-message">Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your environment before using the uploader.</p></AdminShell>

  if (!session) return <AdminShell><form className="admin-form" onSubmit={handleLogin}><span className="section-number">Studio access</span><h1>Upload <em>work.</em></h1><label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="submit-error" role="alert">{error}</p>}<button className="submit-button" disabled={busy} type="submit">{busy ? 'Signing in...' : 'Sign in'}</button></form></AdminShell>

  const visibleGalleryItems = galleryCategory === 'All work' ? galleryItems : galleryItems.filter((item) => item.category === galleryCategory)

  return <AdminShell><div className="admin-heading"><div><span className="section-number">Content studio</span><h1>Add <em>photographs.</em></h1></div><button className="admin-logout" type="button" onClick={() => supabase.auth.signOut()}><FiLogOut /> Sign out</button></div><form className="admin-form" onSubmit={handleUpload}><label>Project title<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="The Seven Vows" /></label><div className="admin-fields"><label>Section<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label><label>Year<input required inputMode="numeric" value={year} onChange={(event) => setYear(event.target.value)} /></label><label>Layout<select value={size} onChange={(event) => setSize(event.target.value)}><option value="wide">Wide</option><option value="tall">Tall</option><option value="square">Square</option></select></label></div><label className="file-drop"><FiUpload /><span>{files.length ? `${files.length} image${files.length === 1 ? '' : 's'} selected` : 'Choose one or more JPG, PNG, or WebP images'}</span><input accept="image/jpeg,image/png,image/webp" multiple required type="file" onChange={(event) => setFiles(Array.from(event.target.files))} /></label>{message && <p className="admin-message" role="status">{message}</p>}{error && <p className="submit-error" role="alert">{error}</p>}<button className="submit-button" disabled={busy} type="submit">{busy ? `Uploading ${files.length} images...` : 'Publish images'} <FiUpload /></button></form><section className="admin-gallery"><div className="admin-gallery-heading"><div><span className="section-number">Published archive</span><h2>Your <em>images.</em></h2></div><select aria-label="Filter published images by category" value={galleryCategory} onChange={(event) => setGalleryCategory(event.target.value)}><option>All work</option>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></div>{visibleGalleryItems.length ? <div className="admin-gallery-grid">{visibleGalleryItems.map((item) => <article className="admin-gallery-item" key={item.id}><img src={item.image_url} alt={item.title} /><div><strong>{item.title}</strong><span>{item.category} / {item.year}</span><button className="admin-delete" disabled={busy} type="button" onClick={() => handleDelete(item)}>Delete</button></div></article>)}</div> : <p className="admin-message">No images published in this section yet.</p>}</section></AdminShell>
}

function getStoragePath(imageUrl) {
  const marker = '/storage/v1/object/public/portfolio/'
  const markerIndex = imageUrl.indexOf(marker)
  return markerIndex === -1 ? '' : decodeURIComponent(imageUrl.slice(markerIndex + marker.length))
}

function AdminShell({ children }) {
  return <main className="admin-page"><a className="admin-back" href="/">Back to portfolio</a><div className="admin-inner">{children}</div></main>
}
