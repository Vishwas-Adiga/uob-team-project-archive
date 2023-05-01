import { useEffect, useState } from "react";
import { Filter as FilterIcon, Information } from "@carbon/icons-react";
import { ExpandUser } from "@carbon/pictograms-react";
import {
  Button,
  Modal,
  Tag,
  Tile,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
} from "@carbon/react";
import { Helmet } from "react-helmet";
import { Accommodation, Course, RecommendedUser } from "../../state/types";
import { AuthenticatedRoute } from "../../components/conditional-route";
import { Config } from "../../config";
import { FilterControls } from "./filter-controls";
import { get } from "../../utils/fetch";
import styles from "./style.module.scss";

export interface Filter {
  minMutuals: number;
  minSimilarity: number;
  courses: Course[];
  accommodations: Accommodation[];
}

export const DEFAULT_FILTER: Filter = {
  minMutuals: 0,
  minSimilarity: 0,
  courses: [],
  accommodations: [],
};

export const Recommendations = () => {
  const [recommendedUsers, setRecommendedUsers] = useState<RecommendedUser[]>(
    []
  );
  useEffect(() => {
    const fetchRecommendations = async () => {
      const response = await get(`recommendations`);
      if (!response.ok) return;
      const reader = response
        .body!.pipeThrough(new TextDecoderStream())
        .getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const payload = value
          .split("\n")
          .slice(0, -1)
          .map(d => JSON.parse(d)) as RecommendedUser[];
        setRecommendedUsers(r => [...r, ...payload]);
      }
    };
    // fetchRecommendations();
  }, []);
  const [filter, setFilter] = useState<Filter>(DEFAULT_FILTER);
  const filteredRecommendations = recommendedUsers
    .filter(r => r.mutualConnections.length >= filter.minMutuals)
    .filter(r => r.similarityScore >= filter.minSimilarity)
    .filter(
      r =>
        filter.courses.length === 0 ||
        filter.courses.find(c => c.courseId === r.course.courseId)
    )
    .filter(
      r =>
        filter.accommodations.length === 0 ||
        filter.accommodations.find(a => a.accommId === r.accommodation.accommId)
    );

  const [filterModalOpen, setFilterModalOpen] = useState(false);

  return (
    <AuthenticatedRoute>
      <div className={styles.container}>
        <Helmet>
          <title>Recommended for you | {Config.APP.NAME}</title>
        </Helmet>
        <Modal
          open={filterModalOpen}
          onRequestClose={setFilterModalOpen.bind(null, false)}
          onRequestSubmit={setFilterModalOpen.bind(null, false)}
          modalHeading="Filter recommendations"
          primaryButtonText="Apply"
          secondaryButtons={[]}
          size="sm"
        >
          <FilterControls setFilter={setFilter} filter={filter} />
        </Modal>
        <div className={styles.header}>
          <h3>Recommended for you</h3>
          <h4>Find new peers to connect with and expand your network</h4>
          <Toggletip align="bottom">
            <ToggletipButton label="Additional information">
              <Information />
            </ToggletipButton>
            <ToggletipContent>
              <h5>How {Config.APP.NAME} recommends users</h5>
              <p>
                {Config.APP.NAME} analyses your connections and suggests users
                to connect with based on course similarity, number of shared
                modules, proximity of accommodation, and number of mutual
                connections.
              </p>
            </ToggletipContent>
          </Toggletip>
        </div>
        <div className={styles.mobileFilter}>
          <Button
            size="sm"
            kind="secondary"
            renderIcon={FilterIcon}
            onClick={setFilterModalOpen.bind(null, true)}
          >
            Filter recommendations
          </Button>
        </div>
        <main id="main-content">
          {recommendedUsers.length === 0 && (
            <div className={styles.nobodyToRecommendContainer}>
              <ExpandUser />
              <h4>
                There's nobody {Config.APP.NAME} can recommend at the moment
              </h4>
              <p>
                Try connecting with a few users to start seeing recommendations
              </p>
            </div>
          )}
          {filteredRecommendations.map(r => (
            <Tile key={r.userId} className={styles.recommendedUser}>
              <img
                src={`api/v1/portfolios/${r.userId}/profile-picture`}
                alt={`${r.name}'s profile picture`}
              />
              <span />
              <h4>{r.name}</h4>
              {r.mutualConnections.length > 0 && <p>Also connected with</p>}
              <div className={styles.recommendedUserMutuals}>
                {r.mutualConnections.slice(0, 3).map(mId => (
                  <img
                    key={mId}
                    src={`api/v1/portfolios/${mId}/profile-picture`}
                    alt="Mutual connection's profile picture"
                  />
                ))}
                {r.mutualConnections.length > 3 && (
                  <p>
                    + {r.mutualConnections.slice(3).length} other
                    {r.mutualConnections.slice(3).length > 1 && "s"}
                  </p>
                )}
              </div>
              <Tag
                className="some-class"
                type={
                  r.similarityScore > 70
                    ? "green"
                    : r.similarityScore > 40
                    ? "teal"
                    : "gray"
                }
                size="md"
                title="Similarity score"
              >
                {r.similarityScore}% match
              </Tag>
              <Button size="sm">
                Connect&nbsp; <span>with {r.name.split(" ")[0]}</span>
              </Button>
            </Tile>
          ))}
        </main>
        <aside>
          <Tile>
            <div className={styles.filterHeader}>
              <FilterIcon size={20} />
              <h5>Filter recommendations</h5>
            </div>
            <FilterControls filter={filter} setFilter={setFilter} />
            <Button
              size="sm"
              kind="secondary"
              onClick={setFilter.bind(null, DEFAULT_FILTER)}
            >
              Reset filters
            </Button>
          </Tile>
        </aside>
      </div>
    </AuthenticatedRoute>
  );
};
