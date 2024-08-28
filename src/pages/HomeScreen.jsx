import React, { Suspense } from 'react'
import { Header, MainSpinner } from '../components'
import { Route, Routes } from 'react-router-dom'
import { HomeContainer } from '../containers'
import {CreateResume, CreateTemplate, TemplateDesignPinDetails, UserProfile} from '../pages'
import Template from '../components/Template'

const HomeScreen = () => {
  return (
    <div className='w-screen h-screen flex flex-col'>
        {/* header */}
        <Header/>
        <main className='w-full'>
           <Suspense fallback={<MainSpinner/>}>
            <Routes>
              <Route path='/' element={<HomeContainer/>} />
              <Route path='/template/create' element={<CreateTemplate/>} />
              <Route path='/profile/:_id' element={<UserProfile/>} />
              <Route path='/resume/*' element={<CreateResume/>} />
              <Route path='/resumeDetail/:templateID' element={<TemplateDesignPinDetails/>} />
              <Route path='/templ' element={<Template/>} />
            </Routes>
           </Suspense>
        </main>
    </div>
  )
}

export default HomeScreen