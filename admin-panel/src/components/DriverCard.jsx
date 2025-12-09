export default function DriverCard({ driver }) {
    return (
      <div className="driver-card">
        <h3>{driver.name}</h3>
        <p>Phone: {driver.phone}</p>
        <p>Status: {driver.status}</p>
        <p>Rating: ⭐ {driver.rating}</p>
      </div>
    );
  }
  