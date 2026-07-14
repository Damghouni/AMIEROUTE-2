import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User } from '@/types';
import { authApi } from '@/lib/api';
import {
  connectSocket,
  joinUserRoom,
  disconnectSocket,
} from '@/lib/socket';


// Types
type AuthApiPayload = {
  user: unknown;
  token: string;
};

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
};


interface AuthState {
  user: User | null;
  token: string | null;
  storeId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<User>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role?: string;
  }) => Promise<User>;

  logout: () => void;

  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  updateUserStore: (storeId: string) => void;
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({

      user: null,
      token: Cookies.get('auth_token') || null,
      storeId: null,

      isLoading: false,
      isAuthenticated: !!Cookies.get('auth_token'),


      // LOGIN
      login: async (email, password) => {

        set({ isLoading: true });

        try {

          const response = await authApi.login(
            email,
            password
          );


          const envelope =
            response.data as
            | ApiEnvelope<AuthApiPayload>
            | AuthApiPayload;


          const payload =
            (envelope as ApiEnvelope<AuthApiPayload>).data
              ? (envelope as ApiEnvelope<AuthApiPayload>).data
              : envelope as AuthApiPayload;



          const token = payload.token;

          const userData = payload.user as any;



          const user: User = {
            ...userData,
            id: userData?._id || userData?.id,
          } as User;



          localStorage.setItem(
            'auth_token',
            token
          );


          Cookies.set(
            'auth_token',
            token,
            {
              expires: 7,
              path: '/',
            }
          );



          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });



          // Socket connection
          connectSocket();

          if (user.id) {
            joinUserRoom(user.id);
          }



          return user;



        } catch (error) {

          set({
            isLoading: false,
          });

          throw error;
        }
      },





      // REGISTER
      register: async (data) => {

        set({
          isLoading: true,
        });


        try {


          const response =
            await authApi.register(data);



          const envelope =
            response.data as
            | ApiEnvelope<AuthApiPayload>
            | AuthApiPayload;



          const payload =
            (envelope as ApiEnvelope<AuthApiPayload>).data
              ? (envelope as ApiEnvelope<AuthApiPayload>).data
              : envelope as AuthApiPayload;



          const token = payload.token;

          const userData = payload.user as any;



          const user: User = {
            ...userData,
            id: userData?._id || userData?.id,
          } as User;




          localStorage.setItem(
            'auth_token',
            token
          );


          Cookies.set(
            'auth_token',
            token,
            {
              expires: 7,
              path: '/',
            }
          );



          set({

            user,

            token,

            storeId:
              user.storeId || null,

            isAuthenticated: true,

            isLoading: false,

          });



          // Socket connection
          connectSocket();


          if (user.id) {
            joinUserRoom(user.id);
          }



          return user;



        } catch (error) {


          set({
            isLoading:false,
          });


          throw error;

        }

      },





      // LOGOUT
      logout: () => {


        disconnectSocket();



        localStorage.removeItem(
          'auth_token'
        );


        Cookies.remove(
          'auth_token',
          {
            path:'/',
          }
        );



        set({

          user:null,

          token:null,

          storeId:null,

          isAuthenticated:false,

        });

      },





      setUser:(user)=>{

        set({

          user,

          isAuthenticated:!!user,

          storeId:
            user?.storeId || null,

        });

      },






      // GET CURRENT USER
      fetchUser: async()=>{


        const token =
          Cookies.get('auth_token')
          ||
          localStorage.getItem(
            'auth_token'
          );



        if(!token) return;



        set({
          isLoading:true,
        });



        try {


          const response =
            await authApi.me();



          const envelope =
            response.data as
            | ApiEnvelope<any>
            | any;



          const userData =
            envelope.data
            ? envelope.data
            : envelope;



          const user:User={

            ...userData,

            id:
              userData?._id
              ||
              userData?.id,

          };



          set({

            user,

            token,

            storeId:
              user.storeId || null,

            isAuthenticated:true,

            isLoading:false,

          });



          connectSocket();


          if(user.id){

            joinUserRoom(user.id);

          }



        } catch(error:any){


          if(error?.response?.status===401){


            disconnectSocket();


            Cookies.remove(
              'auth_token',
              {
                path:'/',
              }
            );


            localStorage.removeItem(
              'auth_token'
            );



            set({

              user:null,

              token:null,

              storeId:null,

              isAuthenticated:false,

              isLoading:false,

            });



          }else{


            set({
              isLoading:false,
            });


          }

        }

      },





      updateUserStore:(storeId)=>{


        set((state)=>({

          storeId,


          user: state.user
          ? {
              ...state.user,
              storeId,
            }
          : null,

        }));

      },

    }),


    {

      name:'auth-storage',

      storage:createJSONStorage(
        ()=>localStorage
      ),

    }

  )
);