import react from 'react';
import styles from './Cards.module.css';
let Card = (props) => {
   
    return(

  <div className={styles.card} id={props.id} key={props.id} >

  <div div className={styles.container}>
 
    {props.label}
  </div>
      <button onClick={props.delete_function}>Delete</button>
  </div>
 
 
    )
}

export default Card;

