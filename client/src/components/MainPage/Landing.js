import Button from '@material-ui/core/Button'
import './Landing.css';
import mainImage from './../../images/mainpageImage.jpg'
import {Link} from 'react-router-dom'

const Landing = () => {

    return (
        <div id="mainpage">
            <div id="leftdiv">
                <h1>Easy shift scheduling for your part-time workforce</h1>
                <p>Restaurant scheduling made easy.  Create schedules with a click.  Empower employees to request time off & view their schedules.  Analytics at your fingertips.</p>
                <Link to="/register"><Button variant="outlined" color="primary">Get Started</Button></Link>
            </div>
            <div id="rightdiv">
                <img src={mainImage} alt=""></img>
            </div>
            <div id="bottomdiv">
                <a href="http://www.freepik.com">Vector image designed by pikisuperstar / Freepik</a> & 
                schedule icon made by <a href="https://www.flaticon.com/authors/becris" title="Becris">Becris</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
            </div>
        </div>
    )
}


export default Landing;