export default function ErrorMessage() {
  return (
    <section className="flex-col center">
      <h1>Something went wrong.</h1>
      <p>Please check if you are using the latest version of you browser.</p>
      <div className="">
        <p className="">Tested versions are:</p>
        <ul>
          <li>Desctop Chrome 91</li>
          <li>Desctop FireFox 89</li>
          <li>Desctop Safari 14</li>
          <li>Mobile Chrome 91</li>
          <li>Mobile Samsung Internet 14</li>
        </ul>
      </div>
    </section>
  )
}