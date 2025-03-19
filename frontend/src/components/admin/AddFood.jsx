import React, {useEffect,useState} from 'react'
import axios from 'axios'


function AddFood() {

    
        const[formdata,setFormdata]=useState({
            name : '',
            ingrediants : '',
            category : '',
            price : '',
            imageUrl : ''
        })

        const[foods,setFoods]=useState({});

        useEffect(() => {
            axios.get('http://localhost:5000/api/foods')
            .then(res => setFoods(res.data))
            .catch(err => console.log(err));
        }, []);

    





  return (
    <div>AddFood</div>
  )
}

export default AddFood