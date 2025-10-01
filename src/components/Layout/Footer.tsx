import { APP_VERSION } from "../../settings/constants";

const Footer: React.FC = () => {
  return (
    <footer>
      <p>Andrzej Rzeźniczak</p>
      <p>
        Fundusze Rodzinne v{APP_VERSION} &copy; {new Date().getFullYear()}.
      </p>
    </footer>
  );
};

export default Footer;
