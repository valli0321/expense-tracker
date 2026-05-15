import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut,
    LuLayoutGrid,
    LuArrowLeftRight,
} from "react-icons/lu";

export const SIDE_MENU_ITEMS = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/dashboard",
    },
    {
        id: "02",
        label: "Transactions",
        icon: LuArrowLeftRight,
        path: "/transaction",
    },
    {
        id: "03",
        label: "Category",
        icon: LuLayoutGrid,
        path: "/category",
    },
    {
        id: "04",
        label: "Logout",
        icon: LuLogOut,
        path: "logout",
    },
];