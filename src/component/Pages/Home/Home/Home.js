import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthProvider';
import PostShow from '../PostShow/PostShow';

const Home = () => {
    const { user } = useContext(AuthContext);
    const { register, formState: { errors }, handleSubmit, reset, } = useForm();
    const imgbbHostKey = '498dc9844224339c0a58f17a04a53403'

    const { data: allPostShow = [], refetch } = useQuery({
        queryKey: ["userPost", user?.email],
        queryFn: async () => {
            const res = await fetch("https://user-server-five.vercel.app/userPost");
            const data = await res.json();
            return data;

        },
    });

    const handlerAddProduct = data => {
        const image = data.image[0];
        const formData = new FormData();
        formData.append('image', image);
        const url = `https://api.imgbb.com/1/upload?key=${imgbbHostKey}`;

        fetch(url, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(imgbb => {
                if (imgbb.success) {
                    const product = {
                        description: data.description,
                        images: imgbb.data.url,
                        photoURL: user.photoURL,
                        email: user.email,
                        displayName: user.displayName,
                    }
                    fetch(`https://user-server-five.vercel.app/userPost`, {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify(product)
                    })
                        .then(res => res.json())
                        .then(result => {
                            toast.success(`Post added successfully`);
                            reset();
                            refetch()

                        })
                }

            })

    }

    return (
        <div className='bg-black py-7'>
            <div className='w-11/12 md:w-8/12 lg:w-6/12 m-auto'>
                <div className='shadow-md bg-dashboardCards rounded-2xl font-rajdhani py-5 space-y-5 hover:brightness-125 lg:max-w-xl mx-auto border-l border-t border-white/20 bg-gray-800 p-5 mb-5'>
                    <div>
                        <form onSubmit={handleSubmit(handlerAddProduct)}>
                            <div className="form-control w-full ">
                                <div className='flex items-center gap-3'>
                                    <label className="">
                                        {
                                            user?.photoURL ?
                                                <img src={user?.photoURL} {...register("profileImg")} alt="" className='w-12 h-12 rounded-full border' />
                                                :
                                                <img src="https://toppng.com/uploads/preview/the-logo-is-a-black-and-white-line-drawling-of-a-man-business-man-icon-11553494320tb9nzj0wmv.png" {...register("profileImg")} alt="" className='w-12 h-12 rounded-full border' />
                                        }
                                    </label>
                                    <textarea type="text" {...register("description")} className="input input-bordered w-full p-2"
                                        placeholder=' Write a Status ' />
                                    {errors.description && <p className='text-orange-400'>{errors.description?.message}</p>}
                                </div>
                            </div>
                            <div className="form-control w-full ">
                                <label className="label">
                                </label>
                                <input type="file" {...register("image")} className="p-2 border rounded-lg" placeholder='image' />
                                {errors.image && <p className='text-orange-400'>{errors.image?.message}</p>}
                            </div>
                            {!user?.uid ?
                                <>
                                    <Link to="/signin" className='text-md font-semibold text-blue-500'>Please Login!</Link>
                                </>
                                :
                                <>
                                    <div className='flex justify-center mt-5'>
                                        <input className='btn btn-info w-full text-white' value=" Post" type="submit" />
                                    </div>
                                </>
                            }
                        </form>
                    </div>
                </div>
                <PostShow
                />
            </div>
        </div>
    );
};

export default Home;