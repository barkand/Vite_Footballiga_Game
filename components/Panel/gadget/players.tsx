import { GridHeader, GridItem, Media, CSkeleton } from "@/core/components";

export default function Players({ teams }: { teams: any }) {
  return (
    <GridHeader spacing={2} rowSpacing={1} justifyContent="center">
      {Array.from({ length: 5 }, (_, i) => (
        <GridItem lg={2} md={3} sm={4} xs={6} key={i + 1}>
          {teams && teams[i]?.image ? (
            <Media
              image={`${import.meta.env.VITE_CLIENT_PATH}/products/${
                teams[i].image
              }`}
              alt={`player-${i + 1}`}
            />
          ) : (
            <CSkeleton width={150} height={250} />
          )}
        </GridItem>
      ))}
    </GridHeader>
  );
}
