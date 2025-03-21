import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { LogOut, User2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="bg-[#2D1E6B] text-white shadow-lg">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-6">
        {/* Make the logo clickable */}
        <Link to="/">
          <h1 className="text-3xl font-bold tracking-wide cursor-pointer">
            Job<span className="text-[#F8B400]">Sphere</span>
          </h1>
        </Link>

        <div className="flex items-center gap-12">
          <ul className="flex font-medium items-center gap-6 text-lg">
            {user && user.role === 'recruiter' ? (
              <>
                <li>
                  <Link to="/admin/companies" className="hover:text-[#F8B400] transition">
                    Companies
                  </Link>
                </li>
                <li>
                  <Link to="/admin/jobs" className="hover:text-[#F8B400] transition">
                    Jobs
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className="hover:text-[#F8B400] transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/jobs" className="hover:text-[#F8B400] transition">
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/browse" className="hover:text-[#F8B400] transition">
                    Browse
                  </Link>
                </li>
              </>
            )}
          </ul>

          {!user ? (
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-[#F8B400] text-[#F8B400] hover:bg-[#F8B400] hover:text-white transition rounded-full px-6 py-2"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#F8B400] hover:bg-[#d99a00] text-white transition rounded-full px-6 py-2">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer border-2 border-[#F8B400]">
                  <AvatarImage src={user?.profile?.profilePhoto} alt="User" />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-72 bg-white text-black shadow-xl rounded-lg">
                <div className="p-4">
                  <div className="flex gap-3 items-center border-b pb-3">
                    <Avatar className="cursor-pointer border-2 border-[#2D1E6B]">
                      <AvatarImage src={user?.profile?.profilePhoto} alt="User" />
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-[#2D1E6B]">{user?.fullname}</h4>
                      <p className="text-sm text-gray-500">{user?.profile?.bio}</p>
                    </div>
                  </div>
                  <div className="flex flex-col mt-3 text-gray-700">
                    {user && user.role === 'student' && (
                      <div className="flex items-center gap-2 cursor-pointer text-[#2D1E6B] hover:text-[#F8B400] transition">
                        <User2 size={18} />
                        <Link to="/profile">
                          <Button variant="link" className="text-inherit">
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    )}

                    <div className="flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-700 transition">
                      <LogOut size={18} />
                      <Button onClick={logoutHandler} variant="link" className="text-inherit">
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;