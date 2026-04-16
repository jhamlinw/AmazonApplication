import { useNavigate } from 'react-router-dom'
import { useCart } from '../CartContext'

function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } =
    useCart()
  const navigate = useNavigate()

  const handleContinueShopping = () => {
    const lastPage = sessionStorage.getItem('lastBooksPage')
    navigate(lastPage || '/')
  }

  if (cart.length === 0) {
    return (
      <>
        <h1 className="mb-4">Shopping Cart</h1>
        <div className="alert alert-info">
          Your cart is empty.{' '}
          <button
            className="btn btn-link p-0 align-baseline"
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Shopping Cart</h1>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={clearCart}
        >
          Clear Cart
        </button>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Book</th>
                  <th style={{ width: '100px' }}>Price</th>
                  <th style={{ width: '150px' }}>Quantity</th>
                  <th style={{ width: '100px' }}>Subtotal</th>
                  <th style={{ width: '80px' }}></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.bookId}>
                    <td>
                      <div className="fw-bold">{item.title}</div>
                      <small className="text-muted">{item.author}</small>
                    </td>
                    <td>${Number(item.price).toFixed(2)}</td>
                    <td>
                      <div className="input-group input-group-sm">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            updateQuantity(item.bookId, item.quantity - 1)
                          }
                        >
                          &minus;
                        </button>
                        <input
                          type="number"
                          className="form-control text-center"
                          value={item.quantity}
                          min="1"
                          onChange={(e) =>
                            updateQuantity(
                              item.bookId,
                              parseInt(e.target.value) || 1
                            )
                          }
                          style={{ maxWidth: '60px' }}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            updateQuantity(item.bookId, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="fw-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => removeFromCart(item.bookId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <strong>Order Summary</strong>
            </div>
            <div className="card-body">
              {cart.map((item) => (
                <div
                  key={item.bookId}
                  className="d-flex justify-content-between mb-2"
                >
                  <span className="text-truncate me-2">
                    {item.title} &times; {item.quantity}
                  </span>
                  <span className="text-nowrap">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="card-footer d-grid gap-2">
              <button className="btn btn-success" disabled>
                Checkout
              </button>
              <button
                className="btn btn-outline-primary"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CartPage
