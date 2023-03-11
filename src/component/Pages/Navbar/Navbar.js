import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);

    const handlerLogOut = () => {
        logOut()
            .then(() => {
            })
            .catch(err => console.log(err));
    }


    return (
        <div className='bg-gray-600'>
            <div className="navbar container  justify-between font-bold">
                
                <div className="navbar-center m-auto">
                    <ul className="menu menu-horizontal p-2 m-auto space-x-3 items-center">
                        <li><Link className='outline text-white hover:underline-offset-8' to='/'>Home</Link></li>

                        {
                            user?.uid ?
                                <>
                                    <Link onClick={handlerLogOut} to='/' className="btn btn-sm btn-info text-white">Sign Out</Link>
                                </>
                                :
                                <>
                                    <Link to='/signIn' className="btn btn-sm btn-info text-white">Sign in</Link>
                                    <Link to='/signUp' className="btn btn-sm btn-info text-white">Sign Up</Link>
                                </>
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;