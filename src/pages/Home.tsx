import "./home.css";

export default function Home({ handleStart }: { handleStart: () => void }) {
  return (
    <>
      <header className="flex-col">
        <h1>Instagram like photo editor.</h1>
      </header>
      <div className="home__container flex-col">
        <p>This is a project to test fabricjs, typescript and reactjs.</p>
        <p>
          It lets you select a photo, apply a filter to it and download it.
          <br />
          It is responsive.
          <br />
          It has a good test suit.
        </p>
        <button className="home__start" onClick={handleStart}>
          Start
        </button>
      </div>
      <footer className="home__footer flex-col">
        <p className="home__footer-name">By Kayvan Arianpour</p>
        <p className="home__footer-version">Version: {process.env.REACT_APP_VERSION}</p>
      </footer>
    </>
  );
}
