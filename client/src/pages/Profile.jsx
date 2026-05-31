import React from "react";

function Profile() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">

        <h1 className="text-4xl font-bold text-green-600 mb-8">
          My Profile
        </h1>

        <div className="space-y-5">

          <div>
            <h2 className="text-gray-500">
              Name
            </h2>

            <p className="text-xl font-semibold">
              {user?.name}
            </p>
          </div>

          <div>
            <h2 className="text-gray-500">
              Email
            </h2>

            <p className="text-xl font-semibold">
              {user?.email}
            </p>
          </div>

          <div>
            <h2 className="text-gray-500">
              User ID
            </h2>

            <p className="text-sm break-all">
              {user?.id}
            </p>
          </div>

        </div>

      </div>

    </div>

  );

}

export default Profile;