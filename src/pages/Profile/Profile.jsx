import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {supabase} from '../../supabase/client';
import {getUserIDbyEmail} from '../../functions/User/getUserIDbyEmail.js';
import {postPost} from '../../functions/Post/postPost.js';
import PostCard from '../../components/PostCard';
import {getAllUserRelation } from '../../functions/Relation/getAllUserRelation';

const Profile = ({token}) => {

    const navigate = useNavigate()
    const [inputText, setInputText] = useState('');
    const [activeUser, setActiveUser] = useState('');
    const [posts, setPosts] = useState([]);

    async function getAllPost() {
        try {
            //
            const user = await getUserIDbyEmail(token.user.email)
            setActiveUser(user[0].id)

            const { data: Post, error: postError  } = await supabase
            .from('Post')
            .select('*')
            .eq('PostUser', user[0].id)
            .order('Created_at', { ascending: false });

            if (postError) {
                throw postError;
            }

            setPosts(Post);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function handleLogout(){
        sessionStorage.removeItem('token');
        navigate('/');
    }

    async function handlePostSubmit(e){
        e.preventDefault()
        const user = await getUserIDbyEmail(token.user.email)
        console.log('A new post has been submitted ' + inputText)
        await postPost(inputText, user[0].id)
        setInputText('');
        getAllPost()
    }

    useEffect(() => {
        getAllPost()
    }, [])

    return (

    <div style={{ backgroundImage: 'url("https://cdn.pixabay.com/photo/2014/08/15/11/29/beach-418742_1280.jpg")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',  // This ensures that the background image stays fixed while scrolling
    height: '150vh',  
    }}>
        <div className='flex h-full w-full'>
            <div className='fixed bg-white h-5/6 w-72 ml-16 mt-6 py-4 rounded-md flex flex-col items-center justify-between'>
                    <div className='flex flex-col items-center'>
                        <h1 className='font-semibold'> Bienvenido, {token.user.user_metadata.first_name}</h1>
                        <div id='navButtons' className='mt-6 flex flex-col justify-center'>
                            <button onClick={() => {navigate('/homepage');}} className="w-52 font-semibold py-1 px-6 text-left">
                                Homepage
                            </button>
                            <button onClick={() => {navigate('/friends');}} className="w-52 font-semibold py-1 px-6 text-left">
                                Friends
                            </button>
                            <button onClick={() => {navigate('/findusers');}} className="w-52 font-semibold py-1 px-6 text-left">
                                Explore
                            </button>
                            <button onClick={() => {navigate('/profile');}} className="bg-blue-400 w-52 hover:bg-blue-500 text-white font-semibold py-1 px-6 rounded-lg text-left">
                                Profile
                            </button>
                        </div>
                    </div>
                    <button onClick={handleLogout} className='ml-2 w-52 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded'>Log out</button>
            </div>
            <div className='ml-96 w-3/5'>
                <div className='mt-6 bg-white rounded-md right-20 p-6 h-fit w-full '>
                    Datos del usuario añadir
                </div>

                <div className=' h-3/4 w-full mt-2 overflow-y-scroll overflow-hidden hover:overflow-y-scroll scrollbar scrollbar-thumb-grey-200 scrollbar-thin'>
                        {posts.length === 0 ? (
                            <div className='bg-white h-50 w-2/2 p-6 mt-6 rounded-md'>
                                <p>There's no post, follow someone.</p>
                            </div>
                        ) : (
                            posts.map((post) => (
                                <PostCard key={post.id} PostUserID={post.PostUser} PostText={post.Text} PostTime={post.Created_at} PostID={post.id} ActiveUserID={activeUser} />
                            ))
                        )}
                </div>

            </div>       
        </div>
    </div>
    )
}

export default Profile

