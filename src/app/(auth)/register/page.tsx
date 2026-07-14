'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { authApi } from '@/lib/api';
import { Button, Input, Card } from '@/components/ui';
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/Card';

type AccountType = 'client' | 'merchant' | 'driver';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: AccountType;
}

const accountTypes = [
  {
    value: 'client' as AccountType,
    label: 'Client',
    icon: '👤'
  },
  {
    value: 'merchant' as AccountType,
    label: 'Commerçant',
    icon: '🏪'
  },
  {
    value: 'driver' as AccountType,
    label: 'Livreur',
    icon: '🚗'
  }
];


export default function RegisterPage() {

  const router = useRouter();

  const [loading,setLoading] = useState(false);


  const [formData,setFormData] = useState<FormData>({
    name:'',
    email:'',
    password:'',
    confirmPassword:'',
    phone:'',
    role:'client'
  });



  const handleChange = (
    field:keyof FormData,
    value:string
  ) => {

    setFormData(prev=>({
      ...prev,
      [field]:value
    }));

  };



  const handleSubmit = async(
    e:FormEvent
  ) => {

    e.preventDefault();


    if(formData.password !== formData.confirmPassword){

      toast.error(
        "Les mots de passe ne correspondent pas"
      );

      return;
    }


    setLoading(true);


    try {


      console.log(
        "REGISTER DATA:",
        formData
      );


      await authApi.register({

        name: formData.name,

        email: formData.email,

        password: formData.password,

        phone: formData.phone || undefined,

        role: formData.role

      });



      toast.success(
        "Inscription réussie"
      );


      router.push('/login');



    } catch(error:any){


      console.log(
        "REGISTER ERROR:",
        error.response?.data
      );


      toast.error(

        error.response?.data?.message ||

        error.response?.data?.errors?.[0]?.msg ||

        "Erreur inscription"

      );


    } finally {

      setLoading(false);

    }

  };



return (

<div className="min-h-screen bg-gray-100 flex items-center justify-center">


<Card
variant="elevated"
padding="lg"
className="w-full max-w-md"
>


<CardHeader>

<CardTitle className="text-center text-2xl">

Inscription

</CardTitle>

</CardHeader>



<CardContent>


<form
onSubmit={handleSubmit}
className="space-y-4"
>



<Input

label="Nom complet"

value={formData.name}

onChange={(e)=>
handleChange(
'name',
e.target.value
)
}

/>



<Input

label="Email"

type="email"

value={formData.email}

onChange={(e)=>
handleChange(
'email',
e.target.value
)
}

/>



<Input

label="Téléphone"

value={formData.phone}

onChange={(e)=>
handleChange(
'phone',
e.target.value
)
}

/>



<Input

label="Mot de passe"

type="password"

value={formData.password}

onChange={(e)=>
handleChange(
'password',
e.target.value
)
}

/>



<Input

label="Confirmer mot de passe"

type="password"

value={formData.confirmPassword}

onChange={(e)=>
handleChange(
'confirmPassword',
e.target.value
)
}

/>




<div>


<label className="block mb-2 font-medium">

Type de compte

</label>



<div className="grid grid-cols-3 gap-2">


{
accountTypes.map((type)=>(


<button

key={type.value}

type="button"

disabled={loading}

onClick={()=>{

console.log(
"ROLE:",
type.value
);

handleChange(
'role',
type.value
);

}}


className={`
border rounded-lg p-3 text-sm

${
formData.role === type.value

?
'bg-blue-600 text-white'

:
'bg-white text-black'
}

`}


>


<div className="text-xl">

{type.icon}

</div>


{type.label}


</button>


))

}


</div>


</div>

<Button
  type="submit"
  fullWidth
  isLoading={loading}
  className="bg-red-600 hover:bg-red-700 text-white"
>
  Créer un compte
</Button>



</form>


</CardContent>



<CardFooter className="justify-center">


<Link
href="/login"
className="text-blue-600"
>

Déjà un compte ? Connexion

</Link>


</CardFooter>


</Card>


</div>

);

}