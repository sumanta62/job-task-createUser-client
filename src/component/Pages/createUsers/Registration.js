import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';

const Registration = () => {
    const { register, formState: { errors }, handleSubmit } = useForm();
    const { createUser, googleSignin, updateUser } = useContext(AuthContext);
    const [signUpError, setSingUpError] = useState("")
    const [createUserEmail, setCreateUserEmail] = useState();
    const navigate = useNavigate();


    const handelSignUp = data => {
        setSingUpError('')
        createUser(data.email, data.password)
            .then(result => {
                const user = result.user;
                // console.log(user);
                const userInfo = {
                    displayName: data.name
                }
                updateUser(userInfo)
                    .then(() => {
                        saveUser(data.name, data.role, data.email);
                        navigate('/');
                        toast.success(`Registration successfully`);
                    })
                    .catch(err => console.log(err));
            })
            .catch(error => {
                setSingUpError(error.message)
            })
    }

    const handlerGoogleSignin = () => {
        googleSignin()
            .then(result => {
                const user = result.user;
                const userInfo = {
                    displayName: user.displayName,
                    role: 'User',
                    email: user.email
                }
                updateUser(userInfo)
                    .then(() => {
                        fetch(`https://user-server-five.vercel.app/users`)
                            .then(res => res.json())
                            .then(result => {
                                const data = result.find(user => user?.email === userInfo?.email)
                                if (!data) {
                                    saveUser(userInfo.displayName, userInfo.role, userInfo.email);
                                }
                                navigate('/')
                                toast.success(`Registration successfully`);
                            }
                            )
                    })
                    .catch(err => console.log(err));
            })
            .catch(error => {
                console.error(error.message);
            })
    }

    const saveUser = (name, role, email) => {
        const user = { name, role, email };
        fetch('https://user-server-five.vercel.app/users', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(data => {
                setCreateUserEmail(email);
            })
    }



    return (
      <div className='bg-black'>
          <div className='py-10 '>
            <div className='h[800px] w-10/12 md:w-8/12 lg:w-2/6 m-auto bg-gray-800 text-white p-4 rounded-lg'>
                <div>
                    <h2 className="text-4xl font-bold text-center">Sign Up!</h2>
                    <form onSubmit={handleSubmit(handelSignUp)}>

                        <div className="form-control w-full ">
                            <label className="label">
                                <span className="">Name</span>
                            </label>
                            <input type="text" {...register("name", { required: "Name is required" })} className="input text-black input-bordered w-full " />
                            {errors.name && <p className='text-orange-400'>{errors.name?.message}</p>}
                        </div>
                        <div className="form-control w-full ">
                            <label className="label">
                                <span className="">Email</span>
                            </label>
                            <input type="email" {...register("email", { required: "Email Address is required" })} className="input text-black input-bordered w-full " />
                            {errors.email && <p className='text-orange-400'>{errors.email?.message}</p>}
                        </div>
                        <div className="form-control w-full ">
                            <label className="label">
                                <span className="">Select User</span>
                            </label>
                            <select
                                {...register("role", { required: "role is required" })}
                                className="select select-bordered w-full text-black">
                                <option>User</option>
                                <option>Admin</option>
                            </select>
                        </div>
                        <div className="form-control w-full ">
                            <label className="label">
                                <span className="">Password</span>
                            </label>
                            <input type="password"
                                {...register("password", {
                                    required: "Password Address is required",

                                    minLength: { value: 6, message: "Password must be 6 characters or length" },
                                })}
                                className="input input-bordered w-full text-black" />
                            {errors.password && <p className='text-orange-400'>{errors.password?.message}</p>}
                        </div>
                        <br />

                        <input className='btn btn-accent w-full text-white' value="Sign Up" type="submit" />
                        <div>
                            {
                                signUpError && <p className='text-orange-400'>{signUpError}</p>
                            }
                        </div>
                    </form>
                    <p>Alrady Habe an Account <Link className='text-primary font-bold' to='/signIn'>Please Sign In</Link></p>
                    <div className="divider">OR</div>
                    <button onClick={handlerGoogleSignin} className='btn btn-info w-full text-white'>SIGN UP WITH GOOGLE</button>
                </div>
            </div>
        </div>
      </div>
    );
};

export default Registration;