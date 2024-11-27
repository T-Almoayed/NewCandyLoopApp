import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firebase, firestore } from '../firebaseConfig';

// تعريف نوع الكوبون
interface Coupon {
  id: string;
  code: string;
  value: number;
  validity: string | Date;
}

export default function MinaKuponger() {
  const [selectedButton, setSelectedButton] = useState('Alla');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // عدادات ديناميكية
  const [allCount, setAllCount] = useState(0);
  const [validCount, setValidCount] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);

  useEffect(() => {
    const fetchCoupons = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        try {
          const couponRef = firestore.collection('coupons').where('userId', '==', user.uid);
          const unsubscribe = couponRef.onSnapshot((snapshot) => {
            const couponList = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                code: data.code || '',
                value: Number(data.value) || 0,
                validity: data.validity ? new Date(data.validity.toDate()) : new Date(),
              } as Coupon;
            });

            setCoupons(couponList);
            setIsLoading(false);

            // تحديث العدادات
            setAllCount(couponList.length);
            const now = new Date();
            setValidCount(couponList.filter((coupon) => new Date(coupon.validity) >= now).length);
            setExpiredCount(couponList.filter((coupon) => new Date(coupon.validity) < now).length);
          });
          return () => unsubscribe();
        } catch (error) {
          console.error('Error fetching coupons:', error);
          setIsLoading(false);
        }
      } else {
        console.log('User not authenticated');
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  useEffect(() => {
    if (selectedButton === 'Alla') {
      setFilteredCoupons(coupons);
    } else if (selectedButton === 'Giltiga') {
      const now = new Date();
      setFilteredCoupons(coupons.filter((coupon) => new Date(coupon.validity) >= now));
    } else if (selectedButton === 'Utgångna') {
      const now = new Date();
      setFilteredCoupons(coupons.filter((coupon) => new Date(coupon.validity) < now));
    }
  }, [selectedButton, coupons]);

  const handlePress = (button: string) => {
    setSelectedButton(button);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mina Kuponger</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === 'Alla' && styles.activeButton,
          ]}
          onPress={() => handlePress('Alla')}
        >
          <Ionicons name="list" size={16} style={styles.icon} />
          <Text
            style={[
              styles.buttonText,
              selectedButton === 'Alla' && styles.activeButtonText,
            ]}
          >
            Alla ({allCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === 'Giltiga' && styles.activeButton,
          ]}
          onPress={() => handlePress('Giltiga')}
        >
          <Ionicons name="checkmark-circle" size={16} style={styles.icon} />
          <Text
            style={[
              styles.buttonText,
              selectedButton === 'Giltiga' && styles.activeButtonText,
            ]}
          >
            Giltiga ({validCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === 'Utgångna' && styles.activeButton,
          ]}
          onPress={() => handlePress('Utgångna')}
        >
          <Ionicons name="close-circle" size={16} style={styles.icon} />
          <Text
            style={[
              styles.buttonText,
              selectedButton === 'Utgångna' && styles.activeButtonText,
            ]}
          >
            Utgångna ({expiredCount})
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Text style={styles.loadingText}>Laddar kuponger...</Text>
      ) : filteredCoupons.length === 0 ? (
        <Text style={styles.noCouponsText}>Inga kuponger tillgängliga.</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          {filteredCoupons.map((item) => {
            const formattedDate = item.validity
              ? new Date(item.validity).toLocaleDateString('sv-SE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Ogiltigt datum';

            return (
              <View
                key={item.id}
                style={[
                  styles.couponContainer,
                  new Date(item.validity) >= new Date()
                    ? styles.validCoupon
                    : styles.expiredCoupon,
                ]}
              >
                <Text style={styles.couponCode}>Kod: {item.code}</Text>
                <Text style={styles.couponValue}>Värde: {item.value} SEK</Text>
                <Text style={styles.couponValidity}>Giltig till: {formattedDate}</Text>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#D81B60',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#D81B60',
    borderRadius: 20,
    backgroundColor: '#FFF',
  },
  buttonText: {
    fontSize: 14,
    color: '#D81B60',
    marginLeft: 5,
  },
  icon: {
    color: '#D81B60',
  },
  activeButton: {
    backgroundColor: '#D81B60',
  },
  activeButtonText: {
    color: '#FFF',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  noCouponsText: {
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
  scrollView: {
    width: '100%',
    maxHeight: 400,
  },
  couponContainer: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  validCoupon: {
    backgroundColor: '#DFF6DD',
  },
  expiredCoupon: {
    backgroundColor: '#FFF5CC',
  },
  couponCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  couponValue: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  couponValidity: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
});
