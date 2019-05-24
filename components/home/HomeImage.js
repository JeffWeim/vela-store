const HomeImage = () =>
  <>
    <img src='https://gallery.mailchimp.com/68a0cce7cc109d78a8b44d7a0/images/69c9e416-74cd-4be5-a8db-7a04763999cb.jpg' className='desktop' alt='' />
    <img src='https://gallery.mailchimp.com/68a0cce7cc109d78a8b44d7a0/images/5a250267-fd4a-44db-8103-8dff543ffa91.jpg' className='mobile' alt='' />
    <style jsx>{`
      img {
        height: calc(100vh - 4rem);
        object-fit: cover;
        width: 100%;
      }
      .desktop {
        display: none;
      }
      @media only screen and (min-width: 768px) {
        img {
          height: calc(100vh);
        }
        .mobile {
          display: none;
        }
        .desktop {
          display: initial;
        }
      }
    `}</style>
  </>

export default HomeImage
