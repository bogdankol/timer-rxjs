import logo from './logo.svg';
import s from './App.module.css';
import { useState, useRef, useEffect } from 'react';

import { timer, interval, fromEvent, takeUntil, map, buffer,filter,  debounceTime } from 'rxjs'


function App() {
  const [hours, setHours] = useState('00')
  const [minutes, setMinutes] = useState('00')
  const [seconds, setSeconds] = useState('00')
  const [isEnabled, setIsEnabled] = useState(true)
  const pauseRef = useRef(null)
  const stopRef = useRef(null)

  const start = () => {
    //pause - doubleClick
    const pauseHandler = fromEvent(pauseRef.current, 'click')
    const buff = pauseHandler.pipe(debounceTime(300))
    const pauseClicks = pauseHandler.pipe(
      buffer(buff),
      map(list => {
        return list.length;
      }),
      filter(x => x === 2)
    )

    //stopClick
    const stopHandler = fromEvent(stopRef.current, 'click')
    stopHandler.pipe().subscribe(setSeconds('00'))
    
    interval(100)
    .pipe(takeUntil(pauseClicks), takeUntil(stopHandler))
    .subscribe(() => {
      setSeconds(prev => {
        if(prev < 9) {
          return ('0' + (Number(prev) + 1) % 60)
        }
        return (Number(prev) + 1) % 60
      })
      // setMinutes(prev => {
      //   console.log(prev, minutes, seconds)
      //   if (seconds > 0 && seconds === 60) {
      //     return Math.floor(seconds % 60)
      //   }
      //   return prev
      // })
    }) 
  }

  // const start = () => {
  //   isEnabled ? timer(0, 1000).subscribe(number => {
  //     setSeconds(('0' + number % 60).slice(-2)) 
  //     setIsEnabled(false)
  //     if (number > 0 && number % 2 === 0) {
  //       setMinutes(('0' + number/2).slice(-2))
  //     } 
  //     if (number > 0 && number % 5 === 0) {
  //       setHours(('0' + number/5).slice(-2))
  //     }
  //   }) :  alert('timer is already running')
  // };

  return ( 
  <div className = {s.App}>
    {`${hours}: ${minutes}: ${seconds}`}
    <button onClick={start}>start</button>
    <button ref={pauseRef}>pause</button>
    <button ref={stopRef}>stop</button>
  </div>
  );
}

export default App;