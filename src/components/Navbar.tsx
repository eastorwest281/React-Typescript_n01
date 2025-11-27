import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  DarkThemeToggle,
  TextInput,
} from "flowbite-react";
import { useState } from "react";
import { useSelectionStore, useModelStore } from "@/stores";
import { LayoutSwitcher } from "./common/LayoutSwitcher";

export function AppNavbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const { searchComponents, factoryModel } = useModelStore();
  const { selectComponent } = useSelectionStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const results = searchComponents(searchQuery);
      if (results.length > 0) {
        selectComponent(results[0].id, "3d", results[0]);
      }
    }
  };

  return (
    <Navbar fluid className="bg-gray-900 border-gray-700">
      <NavbarBrand href="/">
        <svg
          className="mr-3 h-8 w-8 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
          Factory 3D Viewer
        </span>
      </NavbarBrand>

      <div className="flex items-center gap-3 md:order-2">
        {/* 搜尋框 */}
        <form onSubmit={handleSearch} className="hidden md:block">
          <TextInput
            type="search"
            placeholder="搜尋配件..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sizing="sm"
            className="w-48"
          />
        </form>

        {/* 排版模式切換 */}
        <div className="hidden sm:block">
          <LayoutSwitcher variant="icon-only" />
        </div>

        {/* 模型資訊 */}
        {factoryModel && (
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-400">
            <span className="px-2 py-1 bg-gray-800 rounded">
              {factoryModel.components.length} 配件
            </span>
          </div>
        )}

        {/* 深色模式切換 */}
        <DarkThemeToggle />

        <NavbarToggle />
      </div>

      <NavbarCollapse>
        <NavbarLink href="#" active className="text-white">
          檢視器
        </NavbarLink>
        <NavbarLink href="#" className="text-gray-300 hover:text-white">
          專案
        </NavbarLink>
        <NavbarLink href="#" className="text-gray-300 hover:text-white">
          文件
        </NavbarLink>
        <NavbarLink href="#" className="text-gray-300 hover:text-white">
          設定
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}

export default AppNavbar;