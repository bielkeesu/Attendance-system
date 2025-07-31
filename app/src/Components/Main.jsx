function Main({ children }) {
  return (
    <div className="flex w-full my-32 flex-col-reverse items-center justify-around gap-12 p-6 sm:flex-col-reverse md:flex-row">
      {children}
    </div>
  );
}

export default Main;
