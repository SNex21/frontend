import { FC } from "react";
import styles from "./TabBar.module.scss";
import { NavLink, useMatch } from "react-router-dom";
import {
  BookFillIcon,
  HouseFillIcon,
  PersonCropCircleFillIcon,
} from "@repo/ui/icons";
import cn from "classnames";
import { Haptic } from "@/lib/twa/components/Haptic";

interface TabProps {
  title: string;
  path: string;
  icon?: React.ReactNode;
}

const tabs: TabProps[] = [
  {
    title: "Главная",
    path: "/home",
    icon: <HouseFillIcon size={25} />,
  },
  {
    title: "Сочинения",
    path: "/essay",
    icon: <BookFillIcon size={25} />,
  },
  {
    title: "Аккаунт",
    path: "/account",
    icon: <PersonCropCircleFillIcon size={25} />,
  },
];

const TabBar: FC = () => {
  return (
    <div className={styles.container} style={{ zIndex: 210 }}>
      <nav className={styles.tabbar}>
        {tabs.map((tab) => (
          <Tab key={tab.path} {...tab} />
        ))}
      </nav>
    </div>
  );
};

const Tab: FC<TabProps> = ({ title, path, icon }) => {
  const match = useMatch(path);

  return (
    <Haptic type="impact" value="light" event="onTouchStart" asChild>
      <NavLink
        to={path}
        className={cn(styles.tab, { [styles.tab_active!]: !!match })}
      >
        <div className={styles.tab__content}>
          {icon}
          <span className={styles.tab__label}>{title}</span>
        </div>
      </NavLink>
    </Haptic>
  );
};

export { TabBar };
