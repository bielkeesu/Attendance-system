function Button({ children, type, onClick }) {
  return <button onClick={onClick} className={`btn ${[type]}`}>{children}</button>;
}

export default Button;
