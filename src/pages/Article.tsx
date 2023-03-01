import { Grid, Card, Image } from "semantic-ui-react"
import TextTruncate from "react-text-truncate"
import * as api from "./markets/Api"
import SwiperCore, { Pagination, Autoplay, Scrollbar, Navigation } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/swiper.scss"
import "swiper/components/navigation/navigation.scss"
import "swiper/components/scrollbar/scrollbar.scss"
import "swiper/components/pagination/pagination.min.css"
import { useEffect, useState } from "react"
SwiperCore.use([Navigation, Scrollbar, Pagination, Autoplay])

const Article = () => {
  const [promoData, setPromo] = useState([
    {
      article_link: "",
      article_title: "",
      article_image: "",
      article_description: "",
    },
  ])

  function getPromoData() {
    api.getAllPromosData().then((tokenData) => {
      setPromo(tokenData)
    })
  }

  useEffect(() => {
    getPromoData()
  }, [])

  return (
    <Grid className="articleBox">
      <Grid.Column className="start-learning-card featured-feed-card bountiesCard_view">
        {promoData && (
          <Swiper
            slidesPerView={3}
            spaceBetween={30}
            observer={true}
            observeParents={true}
            loop
            autoplay={{ delay: 7000 }}
            className="feedSwiper"
            slideToClickedSlide
            breakpoints={{
              1200: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
            }}
          >
            {promoData.map((data, i) => (
              <SwiperSlide key={i}>
                <Card href={data?.article_link}>
                  <Image src={data?.article_image} wrapped ui={false} />
                  <Card.Content>
                    <Card.Header>
                      <TextTruncate
                        line={2}
                        truncateText="..."
                        text={data?.article_title}
                      />
                    </Card.Header>
                    <Card.Description>
                      <TextTruncate
                        line={3}
                        truncateText="..."
                        text={data?.article_description}
                      />
                    </Card.Description>
                  </Card.Content>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Grid.Column>
    </Grid>
  )
}

export default Article
