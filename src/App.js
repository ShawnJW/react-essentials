import React, { useState, useEffect, useReducer, useRef, createContext, useContext } from "react";
import { Helmet } from "react-helmet";
import './App.css';
import { FaStar } from "react-icons/fa";
import { useInput } from "./components/UseInput";
import { useTrees } from "./index";
import { useFetch } from "./components/UseFetch";

const createArray = ( length ) => [
    ...Array( length )
];

function Star( { selected = false, onSelect } ) {
    return <FaStar color={selected ? "red" : "grey"} onClick={onSelect}/>
}

function StarRating( { totalStars = 5 } ) {
    const [selectedStars, setSelectedStars] = useState( 0 );
    return <>
        {createArray( totalStars ).map( ( n, i ) => (
            <Star key={i} selected={selectedStars > i} onSelect={() => setSelectedStars( i + 1 )}/>
        ) )};
        <p>{selectedStars} of {totalStars}</p>
    </>
}

function App( { login } ) {
    const [data, setData] = useState(
        null
    );

    const [loading, setLoading] = useState(
        false
    );

    const [error, setError] = useState(
        null
    );

    const [checked, setChecked] = useState(
        false
    );

    const [toggled, toggle] = useReducer((checked) => !checked, false)

    const [number, setNumber] = useReducer( ( number, newNumber ) => number + newNumber, 0
    );

    // form methods
    const [titleProps, resetTitle] = useInput("");
    const [colorProps, resetColor] = useInput("#000000")

    const [sounds, setSounds] = useState("");
    const [colors, setColors] = useState("");

    const sound = useRef();
    const color = useRef();

    const submit = (e) => {
        e.preventDefault();
        const soundVal = sound.current.value;
        const colorVal = color.current.value;
        alert(`${soundVal} sounds like ${colorVal}`);
        alert(`${sounds} sounds like ${colors}`);
        alert(`${titleProps.value} sounds like ${colorProps.value}`);
        sound.current.value = "";
        color.current.value = "";

        setSounds("");
        setColors("#000000");

    }

    const initialState = {
        message: "hi"
    };

    function reducer (state, action)  {
        switch(action.type) {
            case "yell":
                return {
                    message: `HEY! I JUST SAID ${state.message}`
                };
            case "whisper":
                return {
                    message: `excuse me, I just said ${state.message}`
                }
        }
    }
    const [state, dispatch] = useReducer(reducer, initialState);

    const { trees } = useTrees();

    useEffect( () => {
        if ( !login ) return;
        setLoading( true );
        fetch( `https://api.github.com/users/${login}` )
            .then( ( response ) => response.json() )
            .then( setData )
            .then( setLoading( false ) )
            .catch( setError )

    }, []);

    // Fetch from custom component
    // const { loading, data, error } = useFetch(`https://api.github.com/users${login}`)




    if ( loading ) return <h1>Loading...</h1>;
    if ( error ) return <pre>JSON.stringify(error, null, 2)</pre>;
    if ( !data ) return null;

    return <div>
        <Helmet>
            <title>
                Congratulations {data.name}'s on Learning React
            </title>
        </Helmet>
        <h1>{data.name}</h1>
        <h2>Webmaster</h2>
        <p>{data.location}</p>
        <img alt={data.login} src={data.avatar_url}/>
        <input type="checkbox" value={checked} onChange={() => setChecked( ( checked ) => !checked )}/>
        <p>{checked ? "checked" : "not checked"}</p>
        <input type="checkbox" value={toggled} onChange={toggle}/>
        <p>{toggled ? "toggled" : "not toggled"}</p>
        <StarRating totalStars={4}/>
        <section>
            <p>Congratulations! {data.name}</p>
        </section>
        <h1 onClick={() => setNumber(1)}>{number}</h1>
        <p>Message: {state.message}</p>
        <button onClick={() => dispatch( { type: "yell" })}>Yell</button>
            <button onClick={() => dispatch( { type: "whisper"})}>Excuse me</button>
        <form onSubmit={submit}>
            <input type="text" ref={sound} placeholder="Sound..."/>
            <input type="color" ref={color}/>
            <button>ADD</button>
        </form>
        <form onSubmit={submit}>
            <input type="text" value={sounds} placeholder="Sounds..." onChange={(e) => setSounds(e.target.value)}/>
            <input type="color" value={colors} onChange={(e) => setColors(e.target.value)}/>
            <button>ADD</button>
        </form>

        <form onSubmit={submit}>
            <input type="text" {...titleProps} placeholder="Sounds..."/>
            <input type="color" {...colorProps} />
            <button>ADD</button>
        </form>

       <div>
           <h1>Trees I've heard of</h1>
           <ul>{trees.map((tree) => (
           <li key={tree.id}>{tree.type}</li>
           ))}</ul>
       </div>
    </div>

    return <div>No User Available</div>
}

export default App;
