import React, { useContext } from 'react';
import { toast } from 'react-hot-toast';
import { AiTwotoneLike } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useQuery } from 'react-query';
import { AuthContext } from '../../../context/AuthProvider';
import Spinner from '../../../Spinner/Spinner';
import useAdmin from '../../useAdmin/useAdmin';

const PostShow = () => {
    const { user } = useContext(AuthContext);
    const [isAdmin] = useAdmin(user?.email)

    const { data: allPostShow = [], refetch, isLoading } = useQuery({
        queryKey: ["userPost", user?.email],
        queryFn: async () => {
            const res = await fetch("https://user-server-five.vercel.app/userPost");
            const data = await res.json();
            return data;
        },
    });

    const handleLike = (id) => {
        fetch(
            `https://user-server-five.vercel.app/posts/like/${id}?email=${user?.email}`,
            {
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                refetch();
            });
    };

    const handlerDelete = (id) => {
        const proceed = window.confirm(
            "Are you sure , you went to cancel this .Comment"
        );
        if (proceed) {
            fetch(`https://user-server-five.vercel.app/userPostDelete/${id}`, {
                method: "DELETE",
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    if (data.deletedCount > 0) {
                        toast.success("Comment Deleted Successfully");
                        refetch();
                    }
                });
        }
    }
    if (isLoading) {
        return <Spinner />
    }

    return (
        <div className='space-y-3'>
            {
                allPostShow.map((postShow, i) =>
                    <div className="bg-dashboardCards rounded-2xl font-rajdhani py-5 space-y-5 hover:brightness-125 lg:max-w-xl mx-auto border-l border-t border-white/20 bg-gray-800 ">
                        <div className="flex justify-between px-5 border-white/20">
                            <div className="flex space-x-2 items-center">
                                <div className="w-12 bg-white/10 hexagon p-1">
                                    <img
                                        src={postShow?.photoURL ? postShow?.photoURL : `https://toppng.com/uploads/preview/the-logo-is-a-black-and-white-line-drawling-of-a-man-business-man-icon-11553494320tb9nzj0wmv.png`}
                                        className="hexagon w-full"
                                        alt='/'
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white flex items-center ">
                                        {postShow?.displayName ? postShow?.displayName : 'Name is None'}
                                    </h3>
                                </div>
                            </div>
                            <div>
                                { (postShow?.email === user?.email || (isAdmin && user?.email) ) &&
                                    <RiDeleteBin6Line
                                        onClick={() => handlerDelete(postShow?._id)}
                                        className='text-white text-xl cursor-pointer' />
                                       
                                }
                            </div>
                        </div>
                        <div className="px-5 space-y-2 text-white">
                            <p>{postShow?.description}</p>
                            {postShow?.images ? (
                                <img src={postShow?.images} className="rounded-md w-full" alt="" />
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className="flex justify-between space-x-5 mx-5 border-t py-2 border-white/10 ">
                            <div className="flex space-x-2 items-center ">
                                <div className=" flex justify-start items-center text-white ">
                                    <AiTwotoneLike
                                        className={`${postShow?.likes?.includes(user?.email)
                                            ? "text-blue-500 text-4xl cursor-pointer p-2 rounded-full bg-blue-500/10 "
                                            : "text-white/30 text-4xl cursor-pointer p-2 rounded-full hover:bg-blue-500/10 hover:text-blue-500"
                                            } `}
                                        title="Like"
                                        onClick={() => handleLike(postShow?._id)}
                                    />
                                    <span className="ml-1">
                                        {postShow?.quantity ? (
                                            postShow.quantity
                                        ) : (
                                            <span className="text-xs">Be the first one</span>
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-5 text-white">
                                <span>{postShow?.quantity ? postShow?.quantity : "0"} Likes</span>

                            </div>
                        </div>
                    </div>
                )
            }

        </div>
    );
};

export default PostShow;