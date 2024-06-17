import React, { useEffect, useState } from "react";

type User = {
  id: number;
  password: string;
  email: string;
  status: boolean;
};

import bcrypt from "bcryptjs";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
export default function Register() {
  /*
    Tạo form cho người dùng đăng nhập\
    Lấy thông tin người dùng
    Khi gửi thông tin lên db.json
    Kiểm tra xem email có tồn tại hay ko
    Nếu có r báo email đã đăng kí
    Dùng truy vấn 
    let email="a@gmail.com"
    axios.get("http://localhost:8080/users?email={}_like=${email}")
    ==> 2 kết quả trả về
    1. Là [] : Chứng tỏ email chưa tồn tại trong mảng users
        + Mã hóa mật khẩu r mới lưu
            dùng thư viện bcripto để má hóa
        + Lưu lên db.json
    2. Là [{}] : Chứng tỏ đã tồn tại

    */

  // useEffect(() => {
  //   let password = "12342421231";
  //   bcrypt.hash(password, 10, async function (err, hash) {
  //     // Store hash in your password DB.
  //     const data = await hash;
  //     console.log(data);
  //   });
  //   // //   let passB = "$2a$10$Y.ExnU5PZ2sVPTX1wNUA0uCgbNwg9KcU4WpeCOUS/iH5hoaZIKeom";
  //   // bcrypt.compare(password, hash, (err, res) => {
  //   //   console.log("So sánh 2 mật khẩu", res);
  //   // });
  // }, []);

  const [inputValue, setInputValue] = useState<User>({
    id: Math.floor(Math.random() * 9999999999999999999),
    email: "",
    password: "",
    status: false,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [repass, setRepass] = useState<string>("");
  const [hashedPassword, setHashedPassword] = useState<string>("");
  let navigate = useNavigate();

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const checkBox = () => {
    setInputValue({
      ...inputValue,
      status: !inputValue.status,
    });
  };

  const validate = () => {
    const newErrors: string[] = [];
    const emailValidate = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!inputValue.email || !emailValidate.test(inputValue.email)) {
      newErrors.push("Please enter a valid email.");
    }

    if (!inputValue.password || inputValue.password.length < 8) {
      newErrors.push("Password must be at least 8 characters long.");
    }

    if (inputValue.password !== confirmPassword) {
      newErrors.push("Passwords do not match.");
    }

    if (!inputValue.status) {
      newErrors.push("You must accept the terms and conditions.");
    }

    setErrors(newErrors);

    return newErrors.length === 0;
  };
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const sendAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    validate();
    if (!validate()) {
      return;
    }

    try {
      const email = inputValue.email;
      const response = await axios.get(
        `http://localhost:8080/users?email=${email}`
      );

      if (response.data.length > 0) {
        setErrors(["Email is already registered."]);
      } else {
        bcrypt.hash(inputValue.password, 10, async (err, hash) => {
          const newUser = {
            ...inputValue,
            password: hash,
          };

          await axios.post("http://localhost:8080/users", newUser);
          alert("Account created successfully!");
          navigate("/login", { state: newUser });
        });
      }
    } catch (error) {
      setErrors([
        "There was an error checking your email. Please try again later.",
      ]);
    }
  };

  let backgroundImage = "https://wallpaperaccess.com/full/187161.jpg";
  return (
    <div>
      <section
        style={{ backgroundImage: `url(${backgroundImage})` }}
        className="bg-gray-50 dark:bg-gray-900 bg-no-repeat bg-cover"
      >
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <p className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img
              className="w-8 h-8 mr-2"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              alt="logo"
            />
            Register
          </p>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an account
              </h1>
              <div className="bg-red-400 rounded-lg ">
                {errors.map((error) => (
                  <>
                    <span className="text-amber-950 text-sm ml-[20px] mt-[20px]">
                      {error}
                    </span>
                    <br />
                  </>
                ))}
              </div>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    onChange={handleChanges}
                    name="email"
                    type="text"
                    value={inputValue.email}
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    onChange={handleChanges}
                    name="password"
                    value={inputValue.password}
                    type="text"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    type="password"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      onClick={checkBox}
                      aria-describedby="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="font-light text-gray-500 dark:text-gray-300"
                    >
                      I accept the{" "}
                      <b className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                        Terms and Conditions
                      </b>
                    </label>
                  </div>
                </div>
                <button
                  onClick={sendAccount}
                  type="submit"
                  className="w-full bg-red-400 bg-primary-600 hover:bg-primary-700 focus:ring-4 text-black focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Create an account
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to={"/login"}
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500 text-black"
                  >
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
