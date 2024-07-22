import React, { Suspense } from 'react';
import {  Route, Routes } from 'react-router-dom';
import {Authentication, HomeScreen} from '../pages';

import {QueryClient,QueryClientProvider} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'

import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MainSpinner } from '../components';
import { ResumeProvider } from '../contexts/ResumeContext';


function App() {
  const queryclient = new QueryClient()
  return (
  <QueryClientProvider client={queryclient}>
    <ResumeProvider>
    <Suspense fallback={<MainSpinner/>}>
    <Routes>
      <Route path='/*' element={<HomeScreen/>}/>
      <Route path='/auth' element={<Authentication/>}/>
    </Routes>
  </Suspense>
  <ToastContainer position='top-right' theme='dark'/>
  <ReactQueryDevtools initialIsOpen={false}/>
  </ResumeProvider>
  </QueryClientProvider>
  );
}

export default App;
