import { useState, useEffect, useCallback } from 'react'

const API = 'http://localhost:3000/api'

export default function App() {
  const [orders, setOrders] = useState([])

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API}/orders`)
      const data = await res.json()
      setOrders([...data].reverse())
    } catch (e) {
      // leave previous state on transient failure
    }
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, 3000)
    return () => clearInterval(interval)
  }, [load])

  async function upd(token, status) {
    await fetch(`${API}/order/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, status }),
    })
    load()
  }

  return (
    <>
      <h1>👨‍🍳 Kitchen Control Center</h1>
      <div className="grid">
        {orders.length === 0 ? (
          <span>No Order Yet</span>
        ) : (
          orders.map((o) => (
            <div key={o.token} className={`card ${o.status}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="token">#{o.token}</span>
                <span style={{ fontSize: 12, opacity: 0.5, fontWeight: 800 }}>
                  {o.status.toUpperCase()}
                </span>
              </div>
              <p style={{ margin: '15px 0' }}>
                <b>Items:</b> {o.items.map((i) => i.name).join(', ')}
              </p>
              {o.status === 'pending' && (
                <button className="btn btn-p" onClick={() => upd(o.token, 'preparing')}>
                  START COOKING
                </button>
              )}
              {o.status === 'preparing' && (
                <button className="btn btn-r" onClick={() => upd(o.token, 'ready')}>
                  MARK AS READY
                </button>
              )}
              {o.rating ? <div className="rating">{'★'.repeat(o.rating)}</div> : null}
            </div>
          ))
        )}
      </div>
    </>
  )
}
