# API And State

## API Client

Admin API code lives in `src/api`.

`src/api/axiosInstance.js` creates `axiosMain`:

- `baseURL`: `VITE_APP_API_URL`.
- Timeout: `10000` ms.
- Request interceptor reads `admin_auth_token` and sends `Authorization: Bearer <token>`.
- Response interceptor passes failures through `errorHandler`.

`src/api/axiosBaseQuery.js` adapts Axios to RTK Query.

## RTK Query Services

| Service            | Main Endpoints                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| `authService`      | `POST /admin/auth/login`, `POST /admin/auth/forgot-password`, `POST /admin/auth/change-password` |
| `dashboardService` | `GET /admin/dashboard`                                                                           |
| `userService`      | `/admin/users` customer management routes                                                        |
| `productService`   | `/admin/products` dish management routes                                                         |
| `ordersService`    | `/admin/orders` routes                                                                           |
| `paymentsService`  | `/admin/payments` routes                                                                         |
| `profileService`   | `/admin/profile/:id` routes                                                                      |

## Auth Cookies

Authentication is persisted in cookies:

```text
admin_auth_token
admin_id
user_theme
```

`src/store/reducers/auth/index.js` stores the login payload, writes cookies, and
reloads the page after login.

## Security Boundary

- This app should use admin auth only.
- This app should call admin API routes only.
- Customer-facing auth and `/customer` routes belong to `The ODC-User-FE`.
- Admin account provisioning belongs to `The ODC-BE`, not this UI.

## Data Consistency Notes

- Dashboard, user management, products, orders, payments, and profile are API-backed.
