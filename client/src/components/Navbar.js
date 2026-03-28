function Navbar({ title, cartCount, onNavigate, currentPage, search, onSearch }) {
  const linkStyle = (active) => ({ color: active ? '#fff' : '#ccc', margin: '0 8px', cursor: 'pointer', fontWeight: active ? 700 : 400 });

  return (
    <div style={{ background: '#000', color: 'white', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>{title}</div>
        <div style={{ color: '#aaa', fontSize: 12, border: '1px solid #444', borderRadius: 4, padding: '2px 6px' }}>Black & White</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={linkStyle(currentPage === 'home')} onClick={() => onNavigate('home')}>Home</span>
        <span style={linkStyle(currentPage === 'cart')} onClick={() => onNavigate('cart')}>Cart</span>
        <span style={linkStyle(currentPage === 'login')} onClick={() => onNavigate('login')}>Login</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search" style={{ borderRadius: 6, border: '1px solid #444', padding: '6px 10px', background: '#111', color: 'white' }} />
        <button style={{ border: '1px solid #666', background: '#222', color: 'white', borderRadius: 6, padding: '7px 12px', cursor: 'pointer' }}>➤</button>
      </div>

      <div style={{ borderRadius: 6, border: '1px solid #444', padding: '6px 10px', background: '#111' }}>Cart: {cartCount}</div>
    </div>
  );
}

export default Navbar;