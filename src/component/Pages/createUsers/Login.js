import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import toast from 'react-hot-toast';

const Login = () => {
    const { register, formState: { errors }, handleSubmit } = useForm();
    const { loginUser, handlerForgete, googleSignin } = useContext(AuthContext);
    const [loginUserEmail, setLoginUserEmail] = useState("")
    const [loginError, setLoginError] = useState('')

    const [resetEmail, setresetEmail] = useState(' ')
const navigate = useNavigate();
   

   
    const handelLogin = data => {
        loginUser(data.email, data.password)
            .then(result => {
                setLoginUserEmail(data.email);
                navigate('/')
                toast.success(`Login successfully`);
            }).catch(error => {
                console.log(error.message)
                setLoginError(error.message);
            })
    }

    const handlerGoogleSignin = () => {
        googleSignin()
            .then(result => {
                const user = result.user;
                console.log(user);
                navigate('/')
                toast.success(`Login successfully`);
            })
            .catch(error => {
                console.error(error.message);
                setLoginError(error.message)
            })

    }

    const handlerForgetePassword = () => {
        handlerForgete(resetEmail)
            .then(() => {
                alert(' Password reaste email send. Please chck your email')
            })
            .catch(error => {
                console.log(error);

            })
    }

    return (
       <div className='bg-black min-h-screen '>
         <div className='py-9 '>
            <div className=' w-10/12 md:w-8/12 lg:w-2/6 m-auto bg-gray-800 text-white p-4 rounded-lg'>
                <div>
                    <h2 className="text-4xl font-bold text-center">Login!</h2>
                    <form onSubmit={handleSubmit(handelLogin)}>
                        <div className="form-control w-full ">
                            <label className="label">
                                <span className="">Email</span>
                            </label>
                            <input type="email" name='email'  {...register("email",
                                {
                                    onBlur: (event) => setresetEmail(event.target.value)
                                },
                                { required: "Email Address is required" })} className="input input-bordered w-full text-black" />
                            {errors.email && <p className='text-orange-400'>{errors.email?.message}</p>}
                        </div>
                        <div className="form-control w-full ">
                            <label className="label">
                                <span className="">Password</span>
                            </label>
                            <input type="password"
                                {...register("password", {
                                    required: "Password Address is required",
                                    minLength: { value: 6, message: "Password must be 6 characters or length" }
                                })}
                                className="input input-bordered w-full text-black" />
                            {errors.password && <p className='text-orange-400'>{errors.password?.message}</p>}
                        </div>
                        <label className="label">
                            
                        </label>

                        <input className='btn btn-info w-full text-white' value="Login" type="submit" />

                        <div>
                            {
                                loginError && <p className='text-orange-400'>{loginError}</p>
                            }
                        </div>
                    </form>
                    <p>New to Doctors Portal <Link className='text-primary font-bold' to='/signUp'>Create new Account</Link></p>

                    <div className="divider">OR</div>
                    <button onClick={handlerGoogleSignin} className='btn btn-info w-full text-white'>CONTINUE WITH GOOGLE</button>
                </div>
            </div>
        </div>
       </div>
    );
};

export default Login;