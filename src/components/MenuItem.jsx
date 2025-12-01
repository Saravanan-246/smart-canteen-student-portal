import { FiPlus } from "react-icons/fi";

export default function MenuItem({ item, onAdd }) {
  return (
    <>
      <div className="food-card">
        
        {/* Veg/Non-Veg Indicator */}
        <span className={`indicator ${item.type === "veg" ? "veg" : "nonveg"}`}></span>

        {/* Food Image */}
        <img 
          src={item.image || "https://via.placeholder.com/150"} 
          alt={item.name} 
          className="food-img"
        />

        {/* Name + Rating */}
        <div className="name-row">
          <h3>{item.name}</h3>
          <span className="rating">⭐ {item.rating || "4.2"}</span>
        </div>

        {/* Price */}
        <p className="price">₹{item.price}</p>

        {/* Add Button */}
        <button 
          onClick={() => onAdd(item)} 
          className="add-btn"
        >
          <FiPlus size={18} /> Add
        </button>
      </div>

      <style>{`
        .food-card {
          background: white;
          padding: 14px;
          border-radius: 16px;
          border: 1px solid #f1d5b6;
          text-align: left;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          position: relative;
          transition: .25s ease;
        }

        .food-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 18px rgba(255,113,41,0.25);
        }

        .food-img {
          width: 100%;
          height: 135px;
          border-radius: 14px;
          object-fit: cover;
        }

        .indicator {
          position: absolute;
          top: 10px;
          left: 10px;
          width: 12px;
          height: 12px;
          border-radius: 3px;
          border: 2px solid black;
        }

        .veg { background: #16a34a; }   /* Green */
        .nonveg { background: #b91c1c; } /* Red */

        .name-row {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          align-items: center;
        }

        h3 {
          margin: 0;
          font-size: 17px;
          font-weight: 600;
          color: #444;
          width: 75%;
        }

        .rating {
          background: #ffe470;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
        }

        .price {
          margin: 6px 0;
          font-size: 18px;
          font-weight: bold;
          color: #ff6a00;
        }

        .add-btn {
          width: 100%;
          padding: 10px;
          background: #ff6a00;
          color: white;
          font-weight: bold;
          display: flex;
          justify-content: center;
          align-items: center;
          border: none;
          gap: 6px;
          border-radius: 30px;
          cursor: pointer;
          font-size: 16px;
          transition: .25s ease;
        }

        .add-btn:hover {
          background: #e85d00;
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
}
