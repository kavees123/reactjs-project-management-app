import react from 'react';
import styles from './Cards.module.css';
let ProgressCard = (props) => {
   
    return(

  <div className={styles.card} id={props.id} key={props.id} >

  <div div className={styles.container}>
 
    {props.label}
  </div>
     
  </div>
 
 
    )
}

export default ProgressCard;

