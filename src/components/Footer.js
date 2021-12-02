const Footer = ({noData}) => {
    return (
        <footer className={`footer ${noData ? 'no-data' : 'loaded'}`}>
            <div className="contact-info">
            <a href="https://github.com/hunhrabo/vincit_bitcoin_tracker" rel="noopener noreferrer"
          target="_blank">
          <i className="fab fa-github fa-2x" aria-hidden="true" />
          <span className="sr-only">GitHub</span>
        </a>
        <a href="mailto:hrabotam@gmail.com">
          <i className="fas fa-envelope fa-2x" aria-hidden="true" />
          <span className="sr-only">Gmail</span>
        </a>
        
        <a
          href="https://www.linkedin.com/in/tam%C3%A1s-hrabovszki-43399455/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <i className="fab fa-linkedin fa-2x" aria-hidden="true" />
          <span className="sr-only">LinkedIn</span>
        </a>
            </div>
            <p>Copyright &copy; Tamas Hrabovszki</p>
            
        </footer>
    )
}

export default Footer
