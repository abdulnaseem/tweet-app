import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SignIn from '../../components/sign_in/sign-in.component'
import SignUp from '../../components/sign_up/sign-up.component'

const Authentication = () => {

    return (
        <Routes>
            <Route path="/sign-in" element={<SignIn />}>
                Sign In
            </Route>
            <Route path="/sign-in" element={<SignUp />}>
                Sign Up
            </Route>
            <Route path="/sign-in" element={<SignUp />}>
                Sign Up
            </Route>
        </Routes>
    )
}

export default Authentication;