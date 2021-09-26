import Button from '@material-ui/core/Button'
import './Landing.css';
import mainImage from './../../images/mainpageImage.jpg'

const Landing = () => {

    return (
        <div id="mainpage">
            <div id="leftdiv">
                <h1>Easy shift scheduling for your part-time workforce</h1>
                <p>Restaurant scheduling made easy.  Create schedules with a click.  Empower employees to request time off & view their schedules.  Analytics at your fingertips.</p>
                <a href="/register"><Button variant="outlined" color="primary">Get Started</Button></a>
            </div>
            <div id="rightdiv">
                <img src={mainImage} alt=""></img>
            </div>
            <div id="bottomdiv">
                <a href="http://www.freepik.com">Vector image designed by pikisuperstar / Freepik</a>
            </div>
        </div>
    )
}


export default Landing;