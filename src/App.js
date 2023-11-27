import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div>
      <li key={0} className="mx-10 flex my-2 text-justify">
        <span className="flex-auto mr-5">this is an item</span>
        <button className="btn">toggle</button>
        <button className="btn ml-2">delete</button>
      </li>
    </div>
  );
}

export default App;
