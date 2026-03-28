function ProductCard({ product, onAdd, onView }) {
  return (
    <div style={{ border: '1px solid #333', borderRadius: 10, background: '#111', overflow: 'hidden', cursor: 'pointer' }}>
      <div style={{ height: 180, overflow: 'hidden' }} onClick={onView}>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
      <div style={{ padding: 12 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>{product.name}</h3>
        <p style={{ margin: 0, color: '#aaa', minHeight: 36 }}>{product.description || 'A premium item from Eternal Attires.'}</p>
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>₹{product.price}</strong>
          <button onClick={onAdd} style={{ border: 'none', background: '#fff', color: '#000', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;