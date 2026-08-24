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

  useEffect(() => {
    if (!supabase) return undefined

    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])

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
    } catch (uploadError) {
      if (uploadedPaths.length) await supabase.storage.from('portfolio').remove(uploadedPaths)
      setError(uploadError.message)
    }
    setBusy(false)
  }

  if (!supabase) return <AdminShell><p className="admin-message">Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your environment before using the uploader.</p></AdminShell>

  if (!session) return <AdminShell><form className="admin-form" onSubmit={handleLogin}><span className="section-number">Studio access</span><h1>Upload <em>work.</em></h1><label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="submit-error" role="alert">{error}</p>}<button className="submit-button" disabled={busy} type="submit">{busy ? 'Signing in...' : 'Sign in'}</button></form></AdminShell>

  return <AdminShell><div className="admin-heading"><div><span className="section-number">Content studio</span><h1>Add <em>photographs.</em></h1></div><button className="admin-logout" type="button" onClick={() => supabase.auth.signOut()}><FiLogOut /> Sign out</button></div><form className="admin-form" onSubmit={handleUpload}><label>Project title<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="The Seven Vows" /></label><div className="admin-fields"><label>Section<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label><label>Year<input required inputMode="numeric" value={year} onChange={(event) => setYear(event.target.value)} /></label><label>Layout<select value={size} onChange={(event) => setSize(event.target.value)}><option value="wide">Wide</option><option value="tall">Tall</option><option value="square">Square</option></select></label></div><label className="file-drop"><FiUpload /><span>{files.length ? `${files.length} image${files.length === 1 ? '' : 's'} selected` : 'Choose one or more JPG, PNG, or WebP images'}</span><input accept="image/jpeg,image/png,image/webp" multiple required type="file" onChange={(event) => setFiles(Array.from(event.target.files))} /></label>{message && <p className="admin-message" role="status">{message}</p>}{error && <p className="submit-error" role="alert">{error}</p>}<button className="submit-button" disabled={busy} type="submit">{busy ? `Uploading ${files.length} images...` : 'Publish images'} <FiUpload /></button></form></AdminShell>
}

function AdminShell({ children }) {
  return <main className="admin-page"><a className="admin-back" href="/">Back to portfolio</a><div className="admin-inner">{children}</div></main>
}
