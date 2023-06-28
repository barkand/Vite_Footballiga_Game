import React from "react";
import { useTranslation } from "react-i18next";

import { PublicContext } from "@/core/context";
import { TransferList } from "@/core/components";
import { PostAuthApi } from "@/core/libs";

export default function Transfer({ setTeams }: any) {
  const { publicCtx } = React.useContext(PublicContext);
  const { t } = useTranslation(["game"]);
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [cardList, setCardList] = React.useState<any>([]);
  const [teamList, setTeamList] = React.useState<any>([]);

  React.useEffect(() => {
    const getTeam = async () => {
      if (!loaded) {
        setLoaded(true);
        return;
      }

      const _result: any = await PostAuthApi(
        {
          lang: publicCtx.culture.name,
        },
        "game/team-card"
      );
      if (_result.code === 200) {
        setCardList(_result.items.cards);
        setTeamList(_result.items.teams);
      }
    };
    getTeam();
  }, [loaded]);

  return (
    <>
      <TransferList
        LeftList={cardList}
        RightList={teamList}
        setTeams={setTeams}
        LeftTitle={t("card-title")}
        RightTitle={t("team-title")}
      />
    </>
  );
}
