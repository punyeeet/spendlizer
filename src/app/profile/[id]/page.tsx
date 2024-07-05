'use client'

export default function ProfilePage({ params }:any) {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <div className="bg-white shadow-md rounded-lg p-6 w-full sm:w-3/4 lg:w-1/2">
                <div className="flex items-center space-x-4">
                    <img
                        className="w-24 h-24 rounded-full object-cover"
                        src="/path-to-your-photo.jpg"
                        alt="Profile Photo"
                    />
                    <div>
                        <h2 className="text-2xl font-bold">Your Name</h2>
                        <h4>{params.id}</h4>
                        <p className="text-gray-600">your.email@example.com</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h3 className="text-xl font-semibold">About Me</h3>
                    <p className="text-gray-700 mt-2">
                        Write a brief description about yourself here. This can include your background,
                        interests, and any other details you would like to share.
                    </p>
                </div>
                <div className="mt-6">
                    <h3 className="text-xl font-semibold">Skills</h3>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        <li>Skill 1</li>
                        <li>Skill 2</li>
                        <li>Skill 3</li>
                    </ul>
                </div>
                <div className="mt-6">
                    <h3 className="text-xl font-semibold">Contact</h3>
                    <p className="text-gray-700 mt-2">
                        Feel free to reach out to me via email or connect with me on social media.
                    </p>
                    <div className="flex space-x-4 mt-2">
                        <a href="https://linkedin.com/in/yourprofile" className="text-blue-600 hover:underline">
                            LinkedIn
                        </a>
                        <a href="https://github.com/yourprofile" className="text-gray-800 hover:underline">
                            GitHub
                        </a>
                        <a href="https://twitter.com/yourprofile" className="text-blue-400 hover:underline">
                            Twitter
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}