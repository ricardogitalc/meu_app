Title: NextJS SSR - JWT (Access/Refresh Token) Authentication with external Backend

URL Source: https://www.thewidlarzgroup.com/blog/nextjs-ssr---jwt-access-refresh-token-authentication-with-external-backend

Markdown Content:
Disclaimer

---

Let’s get something straight. Putting together an authentication flow by yourself is not trivial by any means. Making it secure and reliable requires experience and patience. Please do not use this code in production. It is merely an intro to authentication systems using JWT tokens.

[Should you implement authentication yourself?](https://www.youtube.com/watch?v=Hh_kiZTTBr0)

If you’re building an app that is meant for actual users, please consider using external services like: Auth0, Firebase, Okta, AWS Cognito.

Still reading? That would mean you’re either here to soak up knowledge or just brave enough to roll with your own _Authentication System_ 😎

##### _Let’s get started!_ ✨

## What will we build

**Frontend** - Next.js SSR with TypeScript  
**Backend** - Node.js + Express with TypeScript  
**Database** - Postgres + Prisma as ORM

First - I’ll show you a preview of the final app. I didn’t spend much time styling it, I’m sorry but that’s not the point of this blog post 👀.

#### There will be 3 routes:

- **/frogs** - A screen where the user may admire beautiful frogs. 🐸

![Image 22: Index page with frogs](https://cdn.prod.website-files.com/657dc4c3b1ac103f4cb8b127/65afa41318d9ae9f1fd08c1b_index.png)

- **/register** - A screen where the user can register. After sign-up, the user will be redirected to /

![Image 23: Register page](https://cdn.prod.website-files.com/657dc4c3b1ac103f4cb8b127/65afa4137c9055a4e1e07be4_register.png)

- **/login** - A screen where the user can log in. After sign-in, the user will be redirected to /

![Image 24: Login page](https://cdn.prod.website-files.com/657dc4c3b1ac103f4cb8b127/65afa414a7e07425688d4e7b_login.png)

**That’s all**! Looks easy, huh? Believe me when I say that it’s not. Of course, you can use the code that we will be writing in a moment to make new / your own pages.

##### _I just like frogs_ 🤐

## Motivation

A couple of months ago I was looking for the best solution for handling authentication using access token + refresh token. Fortunately enough, I came across this article: [The Ultimate Guide to handling JWTs on frontend clients GraphQL](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/) by one of my favourite company - Hasura.

I really encourage you to check out their article!

#### So you probably ask: **Why the f… are you even doing this?!**

_Here’s the answer:_

- They are showing GraphQL example - I wanted to try Rest API
- Imo Hasura’s linked NextJS practical example lacks
- Their linked NextJS example also uses GraphQL
- Their linked NextJS example is overcomplicated
- They don’t show how to connect it to Redux which might get hard
- **For fun 🤪**

## What are JWTs 🤔

There are many resources that go into this in more detail than I will.

Just to name a few:

- [JWT.io](https://jwt.io/introduction)
- [Hasura](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/)
- [Web Dev Simplified](https://www.youtube.com/watch?v=7Q17ubqLfaM)

A JWT token is, at its core, a token with a signature that can be used to verify the source of the token. The contents of the token are typically base64 encoded and although not encrypted, the included signature allows us to easily verify that we created this token. What this means for authentication is: If we can verify a token with one of our secrets, we can assume the contents and the request made using it can be trusted.

### Types of JWT Tokens

- **Access token**: short-lived token (in our example it will be around 10 seconds) that let’s user access guarded by content by the signature. When it expires we can “renew” it using refresh token. Gets changed with every “renew” _We will store it in client-side memory_
- **Refresh token**: long living token (in our example 30 days). Used to renew access token. Gets changed with every “renew” _We will store it in server-side memory_

### Flow

1.User logins/registers with credentials. Server responds with accessToken in the reponse + refreshToken in the cookie (secure and httpOnly)

2.Client is authenticated and does their thing.

3.accessToken gets expired after 10 seconds. The client wants to make a request but it gets rejected with 401 status (unauthorized)

4.We then run a request to refresh our accessToken using our refreshToken. (Silent refresh - later on)

Seems easy peasy huh?  
Unfortunately, it gets confusing with SSR and Redux.

## The problem

This flow is intended to solve problems that come up when using NextJS to authenticate a backend on a different domain than the frontend. An example would be:

1.Rest API hosted on Azure/Aws/Provider that fits your needs

2.NextJS app hosted probably on vercel

As a result, you face one main problem with this setup of deployment and it is all about Cookies The best way to store refresh token on the client according to Hasura’s article would be httpOnly Cookie. But here comes the issue.

#### _IT WON’T WORK ACROSS MULTIPLE DOMAINS_

- Your frontend is hosted at vercel (appDomain.com)
- Your backend is hosted at AWS (‘backendDomain.com)

The client won’t send your session cookie to backendDomain.com and the SSR routes at appDomain.com

So how can we store the cookie on the client side, include our cookie in requests to our SSR routes, and on top of that include our cookie in requests to our backend API?

#### _SIMPLE ANSWER_

**We will use our Next.js API as a proxy to backendDomain.com! 🤯**

## I’ve prepared stuff for you…

Imho the best way to learn is doing stuff…  
So please code along with me. For this purpose I’ve prepared a little backend that contains all the necessary endpoints. Endpoints are explained in the github readme 😎

**Feel free to use your own backend, but article will operate on the one that I’ve prepared**

[Backend GitHub](https://github.com/TheWidlarzGroup/JWTAuthBackend)

Also here’s a [starter point](https://github.com/TheWidlarzGroup/nextjs-authentication/tree/starter) to the Next.js app.  
I’ve prepared some UI components so we can focus strictly on the logic side of stuff. We will be using Styled Components + Tailwindscss + [TWG Eslint](https://github.com/TheWidlarzGroup/eslint-config-twg) + [TWG Prettier](https://www.npmjs.com/package/@twgdev/prettier-config)

## Actual code

You can find the repo under this link [Github Repo - master](https://github.com/TheWidlarzGroup/nextjs-authentication/tree/main)

## Step 1. NextJS Api - as a proxy

Finally we’ve set up the starter repo and are ready to go!

Our first task will be to make a [NextJS API](https://nextjs.org/docs/api-routes/introduction). It will operate as our proxy between NextJS Client and Node.js Auth Backend.

Basically it extracts headers from the request **(Client)** and makes the request to the actual backend **(Node.js)** for us. When response hits us, we update **Client** headers from the response headers.

I will show you Login and Refresh token cases, simply because other endpoints are pretty analogical.

Other cases are provided in the [Github Repo - Step 1](https://github.com/TheWidlarzGroup/nextjs-authentication/tree/step1-proxy/pages/api). Feel free to just copy them

_Login case:  
‍_

```
// pages/api/login.ts
import axios from "axios"
import { NextApiRequest, NextApiResponse } from "next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { headers, body } = req

  try {
    const { data, headers: returnedHeaders } = await axios.post(
      'http://localhost:3001/auth/login', // Node.js backend path
      body, // Login body (email + password)
      { headers } // Headers from the Next.js Client
    )
    //  Update headers on requester using headers from Node.js server response
    Object.entries(returnedHeaders).forEach((keyArr) =>
      res.setHeader(keyArr[0], keyArr[1] as string)
    )
    res.send(data) // Send data from Node.js server response
  } catch ({ response: { status, data } }) {
    // Send status (probably 401) so the axios interceptor can run.
    res.status(status).json(data)
  }
}
```

_Refresh token case:_

```
// pages/api/refreshToken.ts
import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {headers} = req
  try {
    const {data, headers: returnedHeaders} = await axios.post(
      'http://localhost:3001/auth/refresh-token', // refresh token Node.js server path
      undefined,
      {
        headers,
      },
    )

    //  Update headers on requester using headers from Node.js server response
    Object.keys(returnedHeaders).forEach(key =>
      res.setHeader(key, returnedHeaders[key]),
    )

    res.status(200).json(data)
  } catch (error) {
    // we don't want to send status 401 here.
    res.send(error)
  }
}
```

_‍_

## Step 2. Custom Axios instance - silent refresh

### **What happens when our short-living access token expires?**

Then our auth guarded requests will fail, and that’s completly fine but… we don’t want our users to manually refresh the page.

#### We want them to just continue using the page without noticing they were logged out

### How do we solve that?

By using [axios interceptors](https://github.com/axios/axios#interceptors).

Basically when we get a response with **401** status (in our case, you can tweak that to your needs), it will try to refresh the token and retry the request using new refreshToken + headers 🔥 _MAGIC!_

We won’t bother writing our own interceptor but you can definitely do that, it’s not that hard.

But for convenience let’s use the existing [library](https://www.npmjs.com/package/axios-auth-refresh) that fits our needs :)

```
$ yarn add axios-auth-refresh cookie set-cookie-parser
```

```
// lib/axios.ts

import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import * as cookie from 'cookie'
import * as setCookie from 'set-cookie-parser'

// Create axios instance.
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
})

// Create axios interceptor
createAuthRefreshInterceptor(axiosInstance, failedRequest =>
  // 1. First try request fails - refresh the token.
  axiosInstance.get('/api/refreshToken').then(resp => {
    // 1a. Clear old helper cookie used in 'authorize.ts' higher order function.
    if (axiosInstance.defaults.headers.setCookie) {
      delete axiosInstance.defaults.headers.setCookie
    }
    const {accessToken} = resp.data
    // 2. Set up new access token
    const bearer = `Bearer ${accessToken}`
    axiosInstance.defaults.headers.Authorization = bearer

    // 3. Set up new refresh token as cookie
    const responseCookie = setCookie.parse(resp.headers['set-cookie'])[0] // 3a. We can't just acces it, we need to parse it first.
    axiosInstance.defaults.headers.setCookie = resp.headers['set-cookie'] // 3b. Set helper cookie for 'authorize.ts' Higher order Function.
    axiosInstance.defaults.headers.cookie = cookie.serialize(
      responseCookie.name,
      responseCookie.value,
    )
    // 4. Set up access token of the failed request.
    failedRequest.response.config.headers.Authorization = bearer

    // 5. Retry the request with new setup!
    return Promise.resolve()
  }),
)

export default axiosInstance
```

## Step 3. State management system - Redux Toolkit (kinda optional)

```
$ yarn add redux @reduxjs/toolkit next-redux-wrapper react-redux
```

#### **I’ve marked this step as kinda optional because you can store the access token anywhere in the memory. It doesn’t have to be Redux specifically**

The main reason behind using redux in our app is because I want to show you how to build a fully functional website (many larger websites use Redux) and because of the ability to persist store in the SSR. We will discuss this later on.

We need to store **Access Token** somewhere in the client memory. I’ve decided to use Redux Toolkit, as the Toolkit gives pleasant experience. If you don’t know what Redux Toolkit is, let me briefly lay it out for you.

It simply is a package that contains helper functions that reduces complexity of stores. Also allows you to write less boilerplate code.

#### And the most useful feature for me

**ALLOWS MUTATING THE STATE OUT OF THE BOX**

_It is a recommended way of handling redux nowadays._

## Step 3.1 Setup slices.

A Redux Toolkit [slice](https://redux-toolkit.js.org/api/createSlice) is a combination of reducer + action creator. It automatically generates action creators and action types.

### Let’s init **auth** slice

```
// lib/slices/auth.ts

import { createSlice, SerializedError, PayloadAction } from '@reduxjs/toolkit'

export enum AuthStates {
  IDLE = 'idle',
  LOADING = 'loading',
}

export interface AuthSliceState {
  accessToken: string
  loading: AuthStates
  me?: {
    name?: string
    email?: string
  }
  error?: SerializedError
}

// That's what we will store in the auth slice.
const internalInitialState = {
  accessToken: '',
  loading: AuthStates.IDLE,
  me: null,
  error: null,
}

// createSlice
export const authSlice = createSlice({
  name: 'auth', // name of the slice that we will use.
  initialState: internalInitialState,
  reducers: {
     // here will end up non async basic reducers.
    updateAccessToken(state: AuthSliceState, action: PayloadAction<{ token: string }>) {
      state.accessToken = action.payload.token
    },
    reset: () => internalInitialState,
  },
  extraReducers: (builder) => {} // here will end up async more complex reducers.
})

// Actions generated automatically by createSlice function
export const { updateAccessToken, reset } = authSlice.actions
```

and similar **frogs** slice

```
// lib/slices/frogs.ts


import { createSlice } from '@reduxjs/toolkit'

export enum FrogStates {
  IDLE = 'idle',
  LOADING = 'loading',
}


const internalInitialState = {
  loading: FrogStates.IDLE,
  frogs: [],
  error: null,
}

export const frogsSlice = createSlice({
  name: 'frogs',
  initialState: internalInitialState,
  reducers: {
    reset: () => internalInitialState,
  },
  extraReducers: (builder) => {},
})

export const { reset } = frogsSlice.actions
```

### Let’s create async actions.

We will use the [createAsyncThunk](https://redux-toolkit.js.org/usage/usage-with-typescript#createasyncthunk) function from **@reduxjs/toolkit**

Now is the time to use the axios instance that we’ve created in Step 2!

Everytime an AsyncThunk requests fails with 401 status it will try to refresh the token and retry the request. For example let’s say you call fetchFrogs function (see below). The flow would be like this:

**EXPIRED ACCESS TOKEN CASE**

```
1. Dispatch fetchFrogs() function.
2. Calls our proxy api/frogs
3. Gets rejected cuz access token has been expired => Status 401 (unauthorized)
4. Axios interceptor sees the **401 status**. Fires
5. Tries to refresh the token
6a. Fails => User wasn't logged in the first place or his refresh token has expired too. User needs to login again.
6b. Refresh token succeds.
7. Retry failed call from step 2 7.**PROFIT!**
```

Fetching frogs 🐸 firstly

```
1. We need to define function unique name - "auth/frogs"
2. Use our newly created axios instance with interceptor - see Step 2
4. Call the 'api/frogs' endpoint which is our proxy server. (pages/api/frogs)
5. Return the response
5a. Catch the error and reject/ return error for further handling.
```

```
// lib/slices/frogs.ts

export const fetchFrogs = createAsyncThunk('auth/frogs', async (_, thunkAPI) => {
  try {
    const response = await axios.get<{ hits: any[] }>('api/frogs') // Call proxy server (api/pages/frogs.ts)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message })
  }
})
```

Since they are similar, I will show two cases for the auth.

If u want to checkout the rest - visit [GitHub repo](https://github.com/TheWidlarzGroup/nextjs-authentication/tree/step6-connect/lib/slices)

```
// lib/slices/auth.ts
export const fetchUser = createAsyncThunk('auth/me', async (_, thunkAPI) => {
  try {
    const response = await axios.get<{ name: string; email: string; type: string }>('api/me') // Call proxy server (api/pages/me.ts)

    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message })
  }
})


export const register = createAsyncThunk(
  'auth/register',
  async (credentials: { email: string; password: string; name: string }, thunkAPI) => {
    try {
      // Register the user with credentials payload (email, password, name)
      const response = await axios.post<{ accessToken: string }>('api/register', credentials) // Call proxy server (api/pages/register.ts)
      // If it succeds -> refetch the user 'api/me' so we're logged in automatically after registration.
      const refetch = await axios.get<{ name: string }>('api/me', {
        headers: { Authorization: `Bearer ${response.data.accessToken}` },
      })
      // return access token + user data
      return { accessToken: response.data.accessToken, me: { name: refetch.data.name } }
    } catch (error) {
      // push error further
      return thunkAPI.rejectWithValue({ error: error.message })
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post<{ accessToken: string }>('api/login', credentials)
      const refetch = await axios.get<{ name: string }>('api/me', {
        headers: { Authorization: `Bearer ${response.data.accessToken}` },
      })
      return { accessToken: response.data.accessToken, me: { name: refetch.data.name } }
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message })
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    const response = await axios.delete<{ accessToken: string }>('api/logout')
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.message })
  }
})
```

### Create extra reducers

When creating AsyncThunk actions, we need to add and handle them manually in the createSlice function.  
We will use builder callback from extraReducers prop.

```
 A "builder callback" function used to add more reducers, or
 an additional object of "case reducers", where the keys should be other
 action types
```

_source:_ [_https://redux-toolkit.js.org/api/createSlice_](https://redux-toolkit.js.org/api/createSlice)

AsyncThunk actions have 3 states.

- **rejected**, when thunkAPI.rejectWithValue({…}) gets called we receive error in the paylod.
- **fulfilled**, action succeds, we get data in the payload.
- **pending**, when action is for example still in state of fetching data.

```
// lib/slices/auth

extraReducers: (builder) => {
    builder.addCase(fetchUser.rejected, (state, action) => {
      // 1. Reset state with initial state + add error to state.
      state = { ...internalInitialState, error: action.error }
      // 2. VERY IMPORTANT! Throw an error!
      throw new Error(action.error.message)
    })
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      // Update the state.
      state.me = action.payload
      state.loading = AuthStates.IDLE
    })
    builder.addCase(register.pending, (state, _action) => {
      // Update the state.
      state.loading = AuthStates.LOADING
    })
  },
```

### Full slices code: [GitHub repo](https://github.com/TheWidlarzGroup/nextjs-authentication/tree/step6-connect/lib/slices)

## Step 3.2 Setup store.

Now comes the time to connect all the slices into store.  
Let’s create store.ts file.

```
// lib/store.ts
import {configureStore, combineReducers, Store} from '@reduxjs/toolkit'
import {authSlice} from './slices/auth'
import {frogsSlice} from './slices/frogs'

const combinedReducers = combineReducers({
  authReducer: authSlice.reducer,
  frogsReducer: frogsSlice.reducer,
})

export const store: Store = configureStore({
  reducer: combinedReducers,
})

export type MyThunkDispatch = typeof store.dispatch
```

Nothing fancy there. Combining the authReducer + frogsReducer, then configuring the store and exporting it.  
Looks pretty normal huh?

**Actaully, there’s a catch here ⚠️** - as u know we will make use of Next.js **SSR**. So we need store on both:

- Server side
- and
- Client side

Using the code above you will have that of course but… You won’t have the stores in sync. The data on the server won’t be the same as in the client store. That’s a big conflict that we want to avoid.  
For cases like this, [next-redux-wrapper](https://github.com/kirill-konshin/next-redux-wrapper) package was created.  
It automatically creates the store instances for you and makes sure they all have the same state.  
Also it provides fancy utility wrapper to use with getServerSideProps, getStaticProps and getInitialProps

Lets add that to our above code.

```
// lib/store.ts
import {configureStore, combineReducers, AnyAction} from '@reduxjs/toolkit'
import {createWrapper, MakeStore, HYDRATE} from 'next-redux-wrapper'
import {authSlice} from './slices/auth'
import {frogsSlice} from './slices/frogs'

// Combine all the slices we created together.
const combinedReducers = combineReducers({
  authReducer: authSlice.reducer,
  frogsReducer: frogsSlice.reducer,
})

// Type that indicates our whole State will be used for useSelector and other things.
export type OurStore = ReturnType<typeof combinedReducers>

const rootReducer = (
  state: ReturnType<typeof combinedReducers>,
  action: AnyAction,
) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      ...action.payload,
    }
    return nextState
  }
  return combinedReducers(state, action)
}

export const store = configureStore<OurStore>({
  reducer: rootReducer,
})

const makeStore: MakeStore = () => store

export const wrapper = createWrapper(makeStore, {storeKey: 'key'})

// Type that will be used to type useDispatch() for async actions.
export type MyThunkDispatch = typeof store.dispatch
```

As you can see, we now have a new function arose: rootReducer. It is a wrapper to our combinedReducers.  
To manage syncing the stores across server and client we need HYDRATE action.type to be handled.

- state contains the old state
- payload contains the state at the moment of static generation or server side rendering, so your reducer must merge it with existing client state properly.

```
const rootReducer = (
  state: ReturnType<typeof combinedReducers>,
  action: AnyAction,
) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      ...action.payload,
    }

    // If action.type is HYDRATE, then return previous
    // server side store state that sits in the action.payload.
    return nextState
  }
  return combinedReducers(state, action)
}
```

_Hydration is a process of population SSR rendered HTML string with JavaScript._

```
1. HTML string gets rendered in the SSR process
2. JS bundle gets created
3. HTML is sent to client. It improves SEO as search engine bots can read the HTML.
4. JS bundle is sent
5. JavaScript bundle gets hydrated to the HTML string
```

**Example in vercel repo:** [**GitHub**](https://github.com/vercel/next.js/tree/canary/examples/with-redux-wrapper)

Then we’ve got MyThunkDispatch TypeScript type which will be used to type our dispatch functions that are using CreateAsyncThunk.

So the last step is to plug the store to the client. To do that we need to simply wrap the whole application with the Provider.

```
// _app.js

import '../styles/styles.css'
import styled from 'styled-components'
import tw from 'twin.macro'
import {Provider} from 'react-redux'
import {wrapper, store} from '../lib/store'
import {Header} from '../components/Header'

export const PageWrapper = styled.main`
  ${tw`text-near-black bg-ice-blue w-full relative`}
  min-height: 100vh;
`

function MyApp({Component, pageProps}) {
  return (
    <Provider store={store}>
      <PageWrapper>
        <Header>
          <Component {...pageProps} />
        </Header>
      </PageWrapper>
    </Provider>
  )
}

export default wrapper.withRedux(MyApp)
```

## Step 4. Higher order function - authorize

Now it’s the time for the main part of the article, specifically making a higher order function that will wrap all our getServerSideProps In every page that we want to be auth guarded we will need to use this function.

Basically it will have a callback = some function that we will provide.  
Most likely it will be function that fetches something guarded from our backend. And before calling that callback our authorize function will do numerous things. Like checking if request has accessToken, refreshing the token, overall managing the tokens.

Some time ago we have created wrapper using next-redux-wrapper library in the store.ts file. this wrapper provides us wrapper.getServerSideProps(context =\> {callback}) function We will use that in a moment to wrap our authorize higher order function.

Let’s start by defining some types:

```
// lib/authorize.ts


// This type contains context of the wrapper.getServerSideProps + State of our store.
export type ContextWithStore = Omit<
  GetServerSidePropsContext & {
    store: Store<OurStore, AnyAction>
  },
  'resolvedUrl'
>

// This type tells us how our callback function will look like.
// We will provide accessToken, store and server response to the callback
// But you can provide whatever you want.
export type Callback = (
  accessToken: string,
  store: Store<OurStore, AnyAction>,
  res: ServerResponse
) => Record<string, unknown> | Promise<Record<string, unknown>>

// General props type for our authorize function.
interface AuthorizeProps {
  context: ContextWithStore
  callback: Callback
}
```

#### Now prepare for CONFUSION 🥶

```
// lib/authorize.ts

export const authorize = async ({context, callback}: AuthorizeProps) => {
  const {store, req, res} = context
  const {dispatch}: {dispatch: MyThunkDispatch} = store // get dispatch action
  const {accessToken} = store.getState().authReducer // get accessToken from memory - redux.
  if (req) {
    axios.defaults.headers.cookie = req.headers.cookie || null

    if (accessToken)
      axios.defaults.headers.Authorization = `Bearer ${accessToken}`
    if (!accessToken) {
      // No accessToken path: Try to refresh the token.
      try {
        const response = await axios.get('/api/refreshToken')
        const newAccessToken = response.data.accessToken
        const responseCookie = setCookie.parse(
          response.headers['set-cookie'],
        )[0]
        axios.defaults.headers.cookie = cookie.serialize(
          responseCookie.name,
          responseCookie.value,
        )
        axios.defaults.headers.Authorization = `Bearer ${newAccessToken}`
        res.setHeader('set-cookie', response.headers['set-cookie'])
        dispatch(updateAccessToken({token: newAccessToken}))
      } catch (error) {
        store.dispatch(reset())
        return null
      }
    }

    try {
      const cbResponse = await callback(accessToken, store, res)
      if (axios.defaults.headers.setCookie) {
        res.setHeader('set-cookie', axios.defaults.headers.setCookie)
        dispatch(
          updateAccessToken({
            token: axios.defaults.headers.Authorization.split(' ')[1],
          }),
        )
        delete axios.defaults.headers.setCookie
      }
      return cbResponse
    } catch (e) {
      store.dispatch(reset())
      return null
    }
  }
}
```

From the look of it, you probably have no idea what’s going on.  
But don’t worry that’s to be expected.

I will guide you step by step with the flow of this crazy function.

**1\. First we destructure needed variables**

```
const {store, req, res} = context // Store component, Request component, Response component
const {dispatch}: {dispatch: MyThunkDispatch} = store // Async dispatch action.
const {accessToken} = store.getState().authReducer // Get accessToken from memory - redux.
```

**2\. Grab refresh token cookie from the client’s brower**

```
if (req) {
    // We take cookies (refresh_token) from the client's browser and set it as ours (server-side)
    axios.defaults.headers.cookie = req.headers.cookie || null
```

**2a. If the access token acquired in Step 1. exists, then assign it to our custom axios instance**

```
if (accessToken) axios.defaults.headers.Authorization = `Bearer ${accessToken}`
```

**3\. Now we split into two paths.  
\- Access Token exists  
\- Access Token doesn’t exist**

Firstly the negative path.

```
if (!accessToken) {
  try {
    const response = await axios.get('/api/refreshToken')
    const newAccessToken = response.data.accessToken

    const responseCookie = setCookie.parse(response.headers['set-cookie'])[0]

    axios.defaults.headers.cookie = cookie.serialize(
      responseCookie.name,
      responseCookie.value,
    )

    axios.defaults.headers.Authorization = `Bearer ${newAccessToken}`

    res.setHeader('set-cookie', response.headers['set-cookie'])

    dispatch(updateAccessToken({token: newAccessToken}))
  } catch (error) {
    store.dispatch(reset())
    return null
  }
}
```

**4\. Call our proxy api to refresh the token**

```
const response = await axios.get('/api/refreshToken')
```

**5\. Grab a new set of tokens from the response**

```
// We got new set of cookies from the response.
const newAccessToken = response.data.accessToken
// Parse the refreshToken cookie using 'set-cookie-parser' library
const responseCookie = setCookie.parse(response.headers['set-cookie'])[0]
```

**6\. Update the set of tokens for the custom axios instance**

```
// Set a fresh cookie header for our axios instance.
axios.defaults.headers.cookie = cookie.serialize(
  responseCookie.name,
  responseCookie.value,
)
// Set a fresh Authorization header for our axios instance.
axios.defaults.headers.Authorization = `Bearer ${newAccessToken}`
```

**7\. Update cookies in the client’s browser + update redux store**

```
// Update the client's refresh token
res.setHeader('set-cookie', response.headers['set-cookie'])
// And last step => update redux store accessToken
dispatch(updateAccessToken({token: newAccessToken}))
```

**8\. Handle errors in try-catch block**

#### _We end up here when we fail in refreshing the token. So basically our refresh token has expired or is invalid. We’re UNAUTHORIZED!_

```
try {
  ...
} catch (error) {
  // Handle error case. The most possible error would be
  // axios.get('/api/refreshToken) failing
  // that would mean our refreshToken has expired or
  // it is simply wrong. So let's reset our auth slice.
  // So we get logged out :)
  // Reset the store!
  store.dispatch(reset())
  // And return nothing :)
  return null
}
```

**9\. Now that we have access token, we can finally call our callback.**

#### _It doesn’t mean we’re authorized yet. Our access token might be expired or invalid_

```
try {
  const cbResponse = await callback(accessToken, store, res)
  if (axios.defaults.headers.setCookie) {
    res.setHeader('set-cookie', axios.defaults.headers.setCookie)
    dispatch(
      updateAccessToken({
        token: axios.defaults.headers.Authorization.split(' ')[1],
      }),
    )
    delete axios.defaults.headers.setCookie
  }
  return cbResponse
} catch (e) {
  store.dispatch(reset())
  return null
}
```

**10\. Call our callback**

```
// We call our callback with provided props: Access Token, Store component, Response Component, we will only use the `store` prop. You can pass what's fiting your needs.
const cbResponse = await callback(accessToken, store, res)
```

**11\. Handle a case where our callback failed and axios interceptor runned**

If our callback has failed for the first time, then most probably it has run our axios interceptor to refresh the token. So because of that, the set of tokens that we have are invalid. We need to update them from the callback response.

```
if (axios.defaults.headers.setCookie) {
  // If callback fired refreshing the token
  // then the interceptor set a helper header (see axios.ts file)
  // that we will use to update the client's refreshToken.
  res.setHeader('set-cookie', axios.defaults.headers.setCookie)
  // We also update the accessToken
  dispatch(
    updateAccessToken({
      token: axios.defaults.headers.Authorization.split(' ')[1],
    }),
  )
  // Then we clean up the header.
  delete axios.defaults.headers.setCookie
}
```

**12\. Return the response from callback**

**13\. Handle errors in try-catch block**

#### _We end up here when callback fn has failed + axios interceptor has failed to refresh the token. So basically we’re UNAUTHORIZED_

```
try {
  // ...
} catch (e) {
  // We're here when axios interceptor fails to refresh the token.
  // Here we should handle indicating that the user is not authorized or logging him out.
  // We will simply reset the store.
  store.dispatch(reset())
  return null
}
```

### Now we could use our function like this

That’s how you can use this function for now. But that’s not what we’re aiming for tho.

```
export const getServerSideProps = wrapper.getServerSideProps(props =>
  authorize(props, async ({store}) => {
    try {
      const name = store.getState().authReducer.me.name
      if (!name) {
        await store.dispatch(fetchUser())
      }
      await store.dispatch(fetchFrogs())

      return {
        props: {
          token: store.getState().authReducer.accessToken,
          frogs: store.getState().authReducer.frogs,
        },
      }
    } catch (error) {
      return null
    }
  }),
)
```

### We will create a wrapper for wrapper.getServerSideProps(...)

We will create a wrapper for wrapper.getServerSideProps(...) that will automatically dispatch the fetchUser() action for us. So we’re not writing it manually on every page.

```
// lib/authorize.ts

interface UserProps {
  callback: Callback;
}

export const user = ({callback}: UserProps) =>
  // 1. We use wrapper from next-wrapper-redux library to wrap our gerServerSideProps
  // with our redux store.
  // property "context" contains store
  wrapper.getServerSideProps(async (context: ContextWithStore) => {
    const {dispatch}: {dispatch: MyThunkDispatch} = context.store
    // 2. Call our authorize Higher order Function
    return authorize({
      context,
      callback: async (...props) => {
        // 3. If we currently don't have our user fetched
        // Then we're not authorized.
        // So try to fetch the user.
        if (!context.store.getState().authReducer.me)
          await dispatch(fetchUser())
        // 4. return the response from the callback
        return callback(...props)
      },
    })
  })
```

#### _Now the usage looks like this_

```
// pages/index.ts

export const getServerSideProps = user({
  callback: async (_, store) => {
    const {dispatch}: {dispatch: MyThunkDispatch} = store
    await dispatch(fetchFrogs())

    return {
      props: {
        frogs: store.getState().frogsReducer.frogs,
      },
    }
  },
})
```

_Definetly looks cleaner! 😎_

## Step 5. Auth Guard

We will now move on to writing a component that will check if user is authenticated In our case it will check if it has “me” object in our redux store.  
But you may implement your own logic to check if user is already authorized

#### \_That’s only an additional check on the front-end. We are checking cookies etc. on the backend + SSR so don’t worry.If you want to have proper admin panel you should consider splitting it into two separate apps =\> client and admin panel

\_

```
// components/AuthGuard.tsx

import React from 'react'
import { useSelector } from 'react-redux'
import { OurStore } from '../lib/store'


// You might want to implement some sort of role system. I will not cover that.
type Props = {
  readonly role?: 'admin'
  readonly customText?: React.ReactNode
}

export const AuthGuard: React.FC<Props> = ({ children, role, customText }) => {
  // Get `me` object from client side redux store.
  const { loading, me } = useSelector((state: OurStore) => state.authReducer)

  // Loading indicator
  if (loading === 'loading') {
    return <>loading...</>
  }

  // Without role allow all authorized users
  if (me) {
    return <>{children}</>
  }

  if (role === 'admin' && me?.role === 'ADMIN') {
    return <>{children}</>
  }

  // This happens if user is unauthorized :)
  return (
    <section>
      <h2 className="text-center">Unauthorized</h2>
      <div className="text-center">
        {customText ||
          "You don't have permission to access this page. Pleae contact an admin if you think something is wrong."}
      </div>
    </section>
  )
}
```

#### _A really simple component ☺️_

Let’s use it in our index.tsx page

```
// pages/index.tsx
import React from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import {useRouter} from 'next/dist/client/router'
import {fetchFrogs} from '../lib/slices/frogs'
import {MyThunkDispatch} from '../lib/store'
import {user} from '../lib/authorize'

// Dynamicaly import the AuthGuard component.
const AuthGuard = dynamic<{readonly customText: React.ReactNode}>(() =>
  import('../components/AuthGuard').then(mod => mod.AuthGuard),
)

type Frog = {id: string; webformatURL: string}

export const Home = ({frogs}: {frogs: Frog[]}) => {
  const router = useRouter()
  return (
    <AuthGuard
      // Our custom message to unauthorized users.
      customText={
        <p className="text-72 mb-24">
          <span
            className="text-primary underline cursor-pointer"
            onClick={() => router.push('/login')}>
            Login
          </span>
          to pet the phrog 👀
        </p>
      }>
      <div className="flex flex-col items-center">
        <p className="text-72 mb-24 text-center">You may pet the phrog 🐸</p>
        {frogs?.map((frog, index) => (
          <div key={index} className="mb-4">
            <Image
              src={frog.webformatURL}
              width={700}
              height={500}
              className="rounded-xl"
            />
          </div>
        ))}
      </div>
    </AuthGuard>
  )
}

export const getServerSideProps = user({
  callback: async (_, store) => {
    const {dispatch}: {dispatch: MyThunkDispatch} = store
    await dispatch(fetchFrogs())

    return {
      props: {
        frogs: store.getState().frogsReducer.frogs,
      },
    }
  },
})

export default Home
```

As you can see we have used [dynamic import](https://nextjs.org/docs/advanced-features/dynamic-import).  
Have a read about it here:

- [Next.js docs](https://nextjs.org/docs/advanced-features/dynamic-import)
- [JS Proposal](https://github.com/tc39/proposal-dynamic-import)

## Step 6. Connect all the building blocks that we have created

**So… this will be the last step of our guide.**

I bet you’re tired after reading this amount of code but hang in there.

Now the most pleasant step - connecting all the dots.

#### \- First lets add Login action to pages/login.tsx

```
// pages/login.tsx
import {useFormik} from 'formik'
import React from 'react'
import * as yup from 'yup'
import {useRouter} from 'next/dist/client/router'
import styled from 'styled-components'
import tw from 'twin.macro'
import {useDispatch} from 'react-redux'
import InputWithError from '../components/InputWithError'
import FormWithLabel from '../components/FormWithLabel'
import Logo from '../components/Logo'
import {MyThunkDispatch} from '../lib/store'
import {login} from '../lib/slices/auth'

// ...Component
const dispatch: MyThunkDispatch = useDispatch()

const formik = useFormik({
  validationSchema: loginSchema,
  initialValues,
  onSubmit: async values => {
    await dispatch(login(values))
    router.push('/')
  },
})
```

You could do some fancy stuff, like if user is already logged in, then don’t allow him to acces login route, but I won’t focus on that in this guide - that would be just client side hacking.

You could wrap it inside AuthGuard and add custom callback that redirects when user is authorized

#### \- Same for registering

```
// pages/register.tsx

// ...Component
const dispatch: MyThunkDispatch = useDispatch()

const formik = useFormik({
  validationSchema: loginSchema,
  initialValues,
  onSubmit: async values => {
    await dispatch(register(values))
    router.push('/')
  },
})
```

#### \- Logging out

We will do it in the Header.tsx component. But feel free to attach the logout action where you want.

```
// components/Header.tsx

<Button
  className="bg-primary absolute rounded-xl p-2 text-white shadow-xl-light left-4 top-4"
  onClick={async () => {
    await dispatch(logout())
    router.push('/login')
  }}>
  Logout
</Button>
```

## The end

And that’s a wrap. The app should be up and running.

As you can see authorization with SSR + Redux using tokens can be really confusing.

It’s my first blog post. Hope it’s not that terrible! 👀

Thanks for reading!

‍

‍
