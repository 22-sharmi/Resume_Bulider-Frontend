import React, { Suspense } from 'react';
import {  Route, Routes } from 'react-router-dom';
import {Authentication, HomeScreen} from '../pages';

import {QueryClient,QueryClientProvider} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'

import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const queryclient = new QueryClient()
  return (
  <QueryClientProvider client={queryclient}>
    <Suspense fallback={<div>Lodding...</div>}>
    <Routes>
      <Route path='/*' element={<HomeScreen/>}/>
      {/* <Route path='/*' element={<HomePage/>}/> */}
      <Route path='/auth' element={<Authentication/>}/>
    </Routes>
  </Suspense>
  <ToastContainer position='top-right' theme='dark'/>
  <ReactQueryDevtools initialIsOpen={false}/>
  </QueryClientProvider>
  );
}

export default App;
