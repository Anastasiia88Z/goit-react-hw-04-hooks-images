import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { fetchPictures } from './services/api';
import Container from './components/Container/Container';
import SearchBar from './components/SearchBar/SearchBar';
import ImageGallery from './components/ImageGallery/ImageGallery';
import Button from './components/Button/Button.jsx';
import Loader from './components/Loader/Loader.jsx';
import Modal from './components/Modal/Modal.jsx';

export default function App() {
  const [pictureName, setPictureName] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [loader, setLoader] = useState('false');

  useEffect(() => {
    if (!pictureName) return;
    async function getFetchPictures() {
      try {
        setLoader('true');

        const gallery = await fetchPictures(pictureName, page);
        if (pictureName.trim() === '' || !gallery.length) {
          return toast.error(
            `Sorry, but there are no pictures with  ${pictureName}`,
          );
        }
        setPictures(prevPictures => [...prevPictures, ...gallery]);

        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      } catch (error) {
        toast.error('Something went wrong');
      } finally {
        setLoader('false');
      }
    }
    getFetchPictures();
  }, [page, pictureName]);

  const handleFormSubmit = pictureName => {
    setPage(1);
    setPictures([]);
    setPictureName(pictureName);
  };

  const loadMoreButtonClick = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleSelectedImage = ImageURL => {
    setShowModal(!showModal);
    setSelectedImg(ImageURL);
  };

  const showButton = pictures.length >= 12;

  return (
    <Container>
      <Toaster />

      <SearchBar onSearch={handleFormSubmit} />

      <ImageGallery pictures={pictures} onSelect={handleSelectedImage} />

      {loader === 'true' && <Loader />}

      {showButton && <Button onClick={loadMoreButtonClick} />}

      {showModal && (
        <Modal
          src={selectedImg}
          alt={selectedImg.tags}
          onSelect={handleSelectedImage}
        />
      )}
    </Container>
  );
}
