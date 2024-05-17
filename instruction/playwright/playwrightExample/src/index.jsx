import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

function App() {
  const [count, setCount] = React.useState(1);
  const [menu, setMenu] = React.useState([]);

  async function getMenu() {
    const response = await fetch('https://jwt-pizza-service.cs329.click/api/order/menu');
    const data = await response.json();
    setMenu(
      data.map((item, i) => (
        <li key={i}>
          {item.title} - {item.description}
        </li>
      ))
    );
  }

  return (
    <div>
      <h1>Pizza</h1>
      <p>{'🍕'.repeat(count)}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button disabled={!!menu.length} onClick={getMenu}>
        Menu
      </button>
      <ul>{menu}</ul>
    </div>
  );
}
