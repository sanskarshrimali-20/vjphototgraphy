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
  const [file, setFile] = useState(null)
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
    if (!file) return setError('Choose an image first.')
    setBusy(true)
    setError('')
    setMessage('')

    const filePath = `${category.toLowerCase().replaceAll(' ', '-')}/${crypto.randomUUID()}-${file.name}`
    const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, file, { contentType: file.type, upsert: false })
    if (uploadError) {
      setError(uploadError.message)
      setBusy(false)
      return
    }

    const { data: publicUrl } = supabase.storage.from('portfolio').getPublicUrl(filePath)
    const { error: insertError } = await supabase.from('gallery_items').insert({ category, image_url: publicUrl.publicUrl, size, title, year })
    if (insertError) {
      await supabase.storage.from('portfolio').remove([filePath])
      setError(insertError.message)
    } else {
      setMessage('Image uploaded. It is now live in the selected section.')
      setTitle('')
      setFile(null)
      event.currentTarget.reset()
    }
    setBusy(false)
  }

  if (!supabase) return <AdminShell><p className="admin-message">Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your environment before using the uploader.</p></AdminShell>

  if (!session) return <AdminShell><form className="admin-form" onSubmit={handleLogin}><span className="section-number">Studio access</span><h1>Upload <em>work.</em></h1><label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="submit-error" role="alert">{error}</p>}<button className="submit-button" disabled={busy} type="submit">{busy ? 'Signing in...' : 'Sign in'}</button></form></AdminShell>

  return <AdminShell><div className="admin-heading"><div><span className="section-number">Content studio</span><h1>Add <em>photographs.</em></h1></div><button className="admin-logout" type="button" onClick={() => supabase.auth.signOut()}><FiLogOut /> Sign out</button></div><form className="admin-form" onSubmit={handleUpload}><label>Project title<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="The Seven Vows" /></label><div className="admin-fields"><label>Section<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label><label>Year<input required inputMode="numeric" value={year} onChange={(event) => setYear(event.target.value)} /></label><label>Layout<select value={size} onChange={(event) => setSize(event.target.value)}><option value="wide">Wide</option><option value="tall">Tall</option><option value="square">Square</option></select></label></div><label className="file-drop"><FiUpload /><span>{file ? file.name : 'Choose a JPG, PNG, or WebP image'}</span><input accept="image/jpeg,image/png,image/webp" required type="file" onChange={(event) => setFile(event.target.files[0])} /></label>{message && <p className="admin-message" role="status">{message}</p>}{error && <p className="submit-error" role="alert">{error}</p>}<button className="submit-button" disabled={busy} type="submit">{busy ? 'Uploading...' : 'Publish image'} <FiUpload /></button></form></AdminShell>
}

function AdminShell({ children }) {
  return <main className="admin-page"><a className="admin-back" href="/">Back to portfolio</a><div className="admin-inner">{children}</div></main>
}
