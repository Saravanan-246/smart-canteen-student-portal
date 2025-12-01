import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";

export default function CartItem({ item, increase, decrease, remove }) {
  return (
    <>
      <div className="cart-card">

        <img
          src={item.image || "https://via.placeholder.com/120"}
          alt={item.name}
        />

        <div className="details">
          <h3>{item.name}</h3>
          <p className="price">₹{item.price}</p>

          <div className="qty-box">
            <button className="qty-btn" onClick={() => decrease(item.id)}>
              <FiMinus size={16} />
            </button>

            <span className="qty-num">{item.qty}</span>

            <button className="qty-btn" onClick={() => increase(item.id)}>
              <FiPlus size={16} />
            </button>
          </div>
        </div>

        <button className="delete-btn" onClick={() => remove(item.id)}>
          <FiTrash2 size={18} />
        </button>
      </div>

      <style>{`
        .cart-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 14px;
          border: 2px solid #ffe6c7;
          background: white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }

        img {
          width: 70px;
          height: 70px;
          object-fit: cover;
          border-radius: 10px;
        }

        .details {
          flex: 1;
        }

        h3 {
          font-size: 16px;
          margin: 0 0 4px;
          font-weight: 600;
        }

        .price {
          font-size: 14px;
          color: #15803d;
          font-weight: bold;
          margin: 0 0 6px;
        }

        .qty-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ffe7d0;
          padding: 6px 10px;
          border-radius: 10px;
          width: fit-content;
        }

        .qty-btn {
          width: 28px;
          height: 28px;
          background: #ff6a00;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .qty-num {
          font-weight: bold;
          font-size: 15px;
          min-width: 22px;
          text-align: center;
        }

        .delete-btn {
          border: none;
          background: #ffdad6;
          color: #d00000;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: .2s;
        }

        .delete-btn:hover {
          background: #ffb7b0;
          transform: scale(1.1);
        }
      `}</style>
    </>
  );
}
