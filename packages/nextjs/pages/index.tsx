import Head from "next/head";
import Link from "next/link";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

const Home = () => {
  return (
    <>
      <Head>
        <title>DAOmocracy</title>
      </Head>

      <div className="bg-white">
        <div style={{ position: "absolute", right: "100px" }}>
          <RainbowKitCustomConnectButton />
        </div>

        <div className="flex items-left flex-col flex-grow pt-10">
          <h1 className="text-left">
            <span className="block text-9xl pl-10 my-soul-font text-primary">DAOmocracy</span>
            <span className="block text-3xl pt-1 pl-20 roboto-font text-primary">
              classic ideals, contemporary approach
            </span>
          </h1>
        </div>

        <div className="hexagon-container">
          <div className="hexagon-group">
            <div className="yellow-hexagon-group">
              <div className="shadow-hexagon"></div>
              <Link href="/vote">
                <div className="hexagon yellow-hexagon">
                  <span className="hexagon-text yellow-hexagon-text">vote</span>
                </div>
              </Link>
            </div>

            <div className="flex gap-6">
              <div className="purple-hexagon-group">
                <div className="shadow-hexagon"></div>
                <Link href="/propose">
                  <div className="hexagon purple-hexagon">
                    <span className="hexagon-text purple-hexagon-text">propose</span>
                  </div>
                </Link>
              </div>
              <div className="blue-hexagon-group">
                <div className="shadow-hexagon"></div>
                <Link href="/review">
                  <div className="hexagon blue-hexagon">
                    <span className="hexagon-text blue-hexagon-text">review</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hexagon-container {
          display: flex;
          justify-content: center;
          align-items: center;
          transform: rotate(15deg);
          padding-bottom: 80px;
          margin: 0;
        }

        .shadow-hexagon {
          position: absolute;
          top: 4px;
          left: 8px;
          width: 300px;
          height: 275px;
          background-color: rgba(0, 0, 0, 0.1);
          clip-path: polygon(50% 0%, 90% 25%, 90% 75%, 50% 100%, 10% 75%, 10% 25%);
          z-index: -1;
          filter: blur(0px);
        }

        .hexagon-group {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .yellow-hexagon-group {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .blue-hexagon-group {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .purple-hexagon-group {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hexagon {
          width: 300px;
          height: 275px;
          position: relative;
          clip-path: polygon(50% 0%, 90% 25%, 90% 75%, 50% 100%, 10% 75%, 10% 25%);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hexagon::before {
          content: "";
          position: absolute;
          width: 260px;
          height: 238px;
          clip-path: polygon(50% 0%, 90% 25%, 90% 75%, 50% 100%, 10% 75%, 10% 25%);
          background-color: white;
        }

        .hexagon-text {
          position: absolute;
          font-family: "MySoul";
          font-size: 45px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-15deg);
          color: #8f8f8f;
        }

        .hexagon:hover .hexagon-text {
          color: white;
        }

        .yellow-hexagon-text {
          color: #e49f1b;
        }

        .purple-hexagon-text {
          color: #8d56a9;
        }

        .blue-hexagon-text {
          color: #49b691;
        }

        .yellow-hexagon {
          background-color: #e49f1b;
        }

        .yellow-hexagon:hover::before {
          background-color: #e49f1b;
        }

        .purple-hexagon {
          background-color: #8d56a9;
        }

        .purple-hexagon:hover::before {
          background-color: #8d56a9;
        }

        .blue-hexagon {
          background-color: #49b691;
        }

        .blue-hexagon:hover::before {
          background-color: #49b691;
        }
      `}</style>
    </>
  );
};

export default Home;
