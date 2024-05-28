import React from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

function App() {
  const [count, setCount] = React.useState(0);
  const [pizzaType, setPizzaType] = React.useState('');
  const [order, setOrder] = React.useState('Choose your pizza!');
  const [menu, setMenu] = React.useState([]);

  async function getMenu() {
    const response = await fetch('https://pizza-service.cs329.click/api/order/menu');
    const data = await response.json();
    setMenu(
      data.map((item, i) => (
        <li key={i}>
          {item.title} - {item.description}
        </li>
      ))
    );
  }

  async function handleOrder() {
    setOrder(`Ordering ${count} ${pizzaType} pizzas`);
  }

  return (
    <div>
      <h1>Pizza</h1>
      <p>{'🍕'.repeat(count) || '👨‍🍳'}</p>
      <label htmlFor='order'>Pizza:</label>
      <div>
        <input type='text' id='pizza-type' value={pizzaType} placeholder='type' onChange={(e) => setPizzaType(e.target.value)} />
        &nbsp;<button onClick={() => setCount(count + 1)}>+1</button>
        &nbsp;
        <button disabled={!count || !pizzaType} onClick={handleOrder}>
          Order
        </button>
      </div>
      <div id='orderValue'>
        <i>{order}</i>
      </div>
      <button disabled={!!menu.length} onClick={getMenu}>
        Menu
      </button>
      <ul>{menu}</ul>
    </div>
  );
}
