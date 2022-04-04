import main from '../assets/images/main.svg'
import Wrapper from '../assets/wrappers/LandingPage'
import { Logo } from '../components'

const Landing = () => {
  return (
      <Wrapper>
          <nav>
            <Logo />
          </nav>
          <div className="container page">
              <div className="info">
                  <h1>Life <span>tracking</span> app</h1>
                  <p>
                  Get your own Paralifer to keep you on your desired path.
                  Our humble servants keeps you updated on your next steps
                  in life, so you don't have to! Just tell them what you want
                  and they'll make sure you get there effectively. Press the button
                  bellow to start taking control of your life and make that dream come true!
                  </p>
                  <button className="btn btn-hero">
                      Get started
                  </button>
              </div>
              <img src={main} alt="life track" className="img main-img"></img>
          </div>
        </Wrapper>
  )
}

export default Landing
